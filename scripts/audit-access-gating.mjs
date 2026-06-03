#!/usr/bin/env node
// Audit Cloudflare Access gating for *.anysigma.com + *-anysigma.pages.dev.
//
// Confidential customer surfaces (wonderful, ivs, zunou, …) must be gated on:
//   - <slug>.anysigma.com           (production)
//   - <slug>-anysigma.pages.dev     (mirror bare hostname)
//   - *.<slug>-anysigma.pages.dev   (mirror wildcard — covers preview deploys)
//
// Anything that's intentionally public lives in `.access-public-allowlist`
// at repo root, one hostname per line (comments with #). If a new hostname
// shows up that's neither gated nor in the allowlist, this script exits 1.
//
// Auth: needs either CLOUDFLARE_API_TOKEN (bearer) or
// CF_API_EMAIL + CF_API_KEY (global). In CI, prefer the scoped token.
//
// Usage:
//   node scripts/audit-access-gating.mjs            # warn-only locally
//   CI=1 node scripts/audit-access-gating.mjs       # strict: exit 1 on findings

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ZONE_NAME = "anysigma.com";
const PAGES_MIRROR_SUFFIX = "-anysigma.pages.dev";
const ALLOWLIST_PATH = resolve(ROOT, ".access-public-allowlist");

// Hostnames that exist for non-web reasons and don't need Access.
const NON_WEB_PREFIXES = ["imap", "pop", "smtp", "webmail", "mta-sts", "_"];

const STRICT = process.env.CI === "1" || process.env.CI === "true";

function authHeaders() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (token) return { Authorization: `Bearer ${token}` };
  const email = process.env.CF_API_EMAIL;
  const key = process.env.CF_API_KEY;
  if (email && key) return { "X-Auth-Email": email, "X-Auth-Key": key };
  console.error("✗ No CF credentials. Set CLOUDFLARE_API_TOKEN or CF_API_EMAIL+CF_API_KEY.");
  process.exit(2);
}

async function cf(path) {
  const r = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const j = await r.json();
  if (!j.success) {
    console.error(`✗ CF API error on ${path}:`, JSON.stringify(j.errors));
    process.exit(2);
  }
  return j.result;
}

function loadAllowlist() {
  if (!existsSync(ALLOWLIST_PATH)) return new Set();
  return new Set(
    readFileSync(ALLOWLIST_PATH, "utf8")
      .split("\n")
      .map((l) => l.replace(/#.*/, "").trim())
      .filter(Boolean),
  );
}

function isNonWeb(host) {
  const first = host.split(".")[0];
  return NON_WEB_PREFIXES.includes(first);
}

async function findAccountId() {
  const accs = await cf("/accounts");
  const match = accs.find((a) =>
    /anysigma|finno/i.test(a.name || ""),
  );
  if (!match) {
    console.error("✗ No account matched 'anysigma' or 'finno'");
    process.exit(2);
  }
  return match.id;
}

async function main() {
  const allowlist = loadAllowlist();
  const accountId = await findAccountId();

  // 1. DNS records on anysigma.com — every CNAME/A/AAAA hostname.
  const zones = await cf(`/zones?name=${ZONE_NAME}`);
  if (!zones.length) {
    console.error(`✗ No zone matching ${ZONE_NAME}`);
    process.exit(2);
  }
  const zoneId = zones[0].id;
  const records = await cf(`/zones/${zoneId}/dns_records?per_page=200`);
  const subdomains = new Set();
  for (const r of records) {
    if (!["A", "AAAA", "CNAME"].includes(r.type)) continue;
    const n = r.name.toLowerCase();
    if (n === ZONE_NAME) continue; // apex is public
    if (isNonWeb(n)) continue;
    subdomains.add(n);
  }

  // 2. Cloudflare Access apps — index by every domain they cover.
  const apps = await cf(`/accounts/${accountId}/access/apps?per_page=200`);
  const gatedHostnames = new Set();
  const pagesDevApps = [];
  for (const a of apps) {
    const domains = a.self_hosted_domains || (a.domain ? [a.domain] : []);
    for (const d of domains) {
      gatedHostnames.add(d.toLowerCase());
    }
    if ((a.domain || "").toLowerCase().endsWith(PAGES_MIRROR_SUFFIX)) {
      pagesDevApps.push({
        id: a.id,
        name: a.name,
        domain: a.domain.toLowerCase(),
        self_hosted_domains: (a.self_hosted_domains || []).map((d) =>
          d.toLowerCase(),
        ),
      });
    }
  }

  // 3. Check each subdomain.
  const findings = [];
  for (const sub of [...subdomains].sort()) {
    if (gatedHostnames.has(sub)) continue;
    if (allowlist.has(sub)) continue;
    findings.push({
      type: "ungated-subdomain",
      host: sub,
      hint: `Add a CF Access app for "${sub}", or add it to ${ALLOWLIST_PATH} if intentionally public.`,
    });
  }

  // 4. Check each pages.dev mirror app has BOTH bare + wildcard.
  for (const app of pagesDevApps) {
    const bare = app.domain;
    const wildcard = "*." + bare;
    const hasBare = app.self_hosted_domains.includes(bare);
    const hasWild = app.self_hosted_domains.includes(wildcard);
    if (hasBare && hasWild) continue;
    if (allowlist.has(bare)) continue;
    findings.push({
      type: "missing-wildcard",
      host: bare,
      hint: `Access app "${app.name}" only covers ${JSON.stringify(
        app.self_hosted_domains,
      )}. Add "${wildcard}" so per-deployment preview URLs (<hash>.${bare}) are also gated.`,
    });
  }

  // 5. Report.
  console.log("=== anysigma.com Access gating audit ===");
  console.log(`Apex anysigma.com: public (by design)`);
  console.log(`Allowlist entries: ${allowlist.size}`);
  console.log(`Subdomains in DNS: ${subdomains.size}`);
  console.log(`*-anysigma.pages.dev apps: ${pagesDevApps.length}`);
  console.log();

  if (!findings.length) {
    console.log("✓ All confidential surfaces gated. Pages.dev mirrors carry wildcards.");
    return;
  }

  console.log(`✗ ${findings.length} finding(s):`);
  for (const f of findings) {
    console.log(`  [${f.type}] ${f.host}`);
    console.log(`           ${f.hint}`);
  }
  console.log();
  console.log(
    `If any of these are intentionally public, add the hostname to ${ALLOWLIST_PATH}.`,
  );
  console.log("Otherwise add a CF Access app (with wildcard for pages.dev) before merging.");

  if (STRICT) process.exit(1);
}

main().catch((e) => {
  console.error("✗ Audit crashed:", e.message);
  process.exit(2);
});
