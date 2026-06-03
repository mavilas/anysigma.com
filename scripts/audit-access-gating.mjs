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

async function cf(path, { soft = false } = {}) {
  const r = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const j = await r.json();
  if (!j.success) {
    if (soft) {
      console.warn(`⚠ CF API soft-error on ${path}:`, JSON.stringify(j.errors));
      return null;
    }
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
  // Prefer explicit env var — a scoped CI token usually can't list /accounts.
  if (process.env.CLOUDFLARE_ACCOUNT_ID) return process.env.CLOUDFLARE_ACCOUNT_ID;
  const accs = await cf("/accounts");
  // Exact match first, then narrow contains so we don't match 'finnoland' etc.
  const target = ["finno k.k.", "anysigma"];
  let match = accs.find((a) => target.includes((a.name || "").toLowerCase()));
  if (!match) {
    match = accs.find((a) => /^anysigma\b|^finno\b/i.test(a.name || ""));
  }
  if (!match) {
    console.error("✗ No account matched. Set CLOUDFLARE_ACCOUNT_ID env var.");
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
  // An app's pages.dev coverage may live in self_hosted_domains even when
  // its top-level `domain` is a different hostname. Inspect both.
  const apps = await cf(`/accounts/${accountId}/access/apps?per_page=200`);
  const gatedHostnames = new Set();
  const pagesDevAppsByMirror = new Map(); // bare hostname → app summary
  for (const a of apps) {
    const shd = (a.self_hosted_domains || []).map((d) => d.toLowerCase());
    const top = (a.domain || "").toLowerCase();
    const all = new Set([...(top ? [top] : []), ...shd]);
    for (const d of all) gatedHostnames.add(d);
    for (const d of all) {
      if (!d.endsWith(PAGES_MIRROR_SUFFIX)) continue;
      const bare = d.startsWith("*.") ? d.slice(2) : d;
      if (!pagesDevAppsByMirror.has(bare)) {
        pagesDevAppsByMirror.set(bare, {
          id: a.id,
          name: a.name,
          domain: bare,
          self_hosted_domains: shd.length ? shd : top ? [top] : [],
        });
      }
    }
  }
  const pagesDevApps = [...pagesDevAppsByMirror.values()];

  // 3. Pages projects — enumerate every project so an un-wired Pages
  // mirror (no custom DNS) doesn't silently slip past the DNS scan.
  // Pages API caps per_page at ~100; soft-fail so missing Pages:Read scope
  // doesn't break the whole audit (DNS + Access scan still catches most).
  const pagesProjects = (await cf(
    `/accounts/${accountId}/pages/projects`,
    { soft: true },
  )) || [];

  // 4. Findings.
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
  for (const p of pagesProjects) {
    const mirror = `${p.name.toLowerCase()}.pages.dev`;
    if (!mirror.endsWith(PAGES_MIRROR_SUFFIX)) continue;
    if (pagesDevAppsByMirror.has(mirror)) continue;
    if (allowlist.has(mirror)) continue;
    findings.push({
      type: "pages-project-no-access-app",
      host: mirror,
      hint: `CF Pages project "${mirror}" exists but no Access app covers it. Create one with self_hosted_domains: ["${mirror}", "*.${mirror}"], or add it to ${ALLOWLIST_PATH}.`,
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
