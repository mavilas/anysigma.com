// GET /admin/votes — Marco-only view of every recorded vote.
// Allow-list is matched against the Cloudflare Access user email.

interface Env {
  ZUNOU_VOTES: KVNamespace;
}

const ADMIN_EMAILS = new Set([
  "marco@anysigma.com",
  "mgmafo@gmail.com",
  "majin@anysigma.com",
]);

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const email = ctx.request.headers.get("cf-access-authenticated-user-email");
  if (!email || !ADMIN_EMAILS.has(email)) {
    return new Response(
      `<!doctype html><meta charset="utf-8"><title>403</title>
      <body style="font-family:system-ui;padding:3rem;max-width:40rem;color:#222">
      <h1>403 · Not for you</h1>
      <p>This page is admin-only. Signed in as <code>${escapeHtml(email || "(unknown)")}</code>.</p>
      </body>`,
      { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // Pull all vote records (prefix: vote:)
  const list = await ctx.env.ZUNOU_VOTES.list({ prefix: "vote:" });
  const records: any[] = [];
  for (const k of list.keys) {
    const val = await ctx.env.ZUNOU_VOTES.get(k.name);
    if (!val) continue;
    try {
      records.push(JSON.parse(val));
    } catch {
      // skip
    }
  }

  // Group by decision; show vote tallies
  const tally: Record<string, Record<string, number>> = {};
  for (const r of records) {
    tally[r.decision] ??= { "on-board": 0, concern: 0, object: 0 };
    if (r.vote in tally[r.decision]) tally[r.decision][r.vote]++;
  }

  const dnum = (d: string) => parseInt(d.replace("d", ""), 10);
  const decisions = Object.keys(tally).sort((a, b) => dnum(a) - dnum(b));

  // Group records by user for "who said what"
  const byUser: Record<string, Record<string, string>> = {};
  for (const r of records) {
    byUser[r.email] ??= {};
    byUser[r.email][r.decision] = r.vote;
  }
  const users = Object.keys(byUser).sort();

  const vDot = (v: string) =>
    v === "on-board"
      ? "🟢"
      : v === "concern"
      ? "🟡"
      : v === "object"
      ? "🔴"
      : "·";

  const html = `<!doctype html>
<meta charset="utf-8">
<title>Zunou strategy · vote admin</title>
<meta name="robots" content="noindex,nofollow">
<style>
  :root {
    --ink: oklch(0.18 0.012 250);
    --ink-soft: oklch(0.42 0.012 250);
    --paper: oklch(0.99 0.005 90);
    --paper-soft: oklch(0.96 0.012 88);
    --line: oklch(0.88 0.012 90);
    --accent: oklch(0.6 0.18 28);
  }
  body { font-family: "Inter", system-ui, sans-serif; background: var(--paper); color: var(--ink); padding: 3rem 1.5rem; max-width: 70rem; margin: 0 auto; line-height: 1.55; }
  h1 { font-family: Georgia, serif; font-weight: 400; font-size: 2rem; margin: 0 0 0.5rem; letter-spacing: -0.01em; }
  h2 { font-family: Georgia, serif; font-weight: 400; font-size: 1.4rem; margin: 2.5rem 0 1rem; }
  .meta { color: var(--ink-soft); font-size: 0.875rem; margin-bottom: 2rem; }
  table { width: 100%; border-collapse: collapse; font-size: 0.875rem; margin-bottom: 1rem; }
  th, td { border: 1px solid var(--line); padding: 0.5rem 0.75rem; text-align: left; }
  th { background: var(--paper-soft); font-weight: 600; }
  td.num { font-family: ui-monospace, monospace; text-align: center; }
  .pill { display: inline-block; padding: 0.1em 0.5em; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600; font-family: ui-monospace, monospace; }
  .pill-green { background: oklch(0.93 0.04 155); color: oklch(0.45 0.13 155); }
  .pill-amber { background: oklch(0.95 0.05 75); color: oklch(0.55 0.15 75); }
  .pill-red { background: oklch(0.95 0.04 25); color: oklch(0.5 0.2 25); }
  code { font-family: ui-monospace, monospace; font-size: 0.85em; padding: 0.1em 0.3em; background: var(--paper-soft); border: 1px solid var(--line); border-radius: 0.25rem; }
  .empty { color: var(--ink-soft); font-style: italic; }
</style>

<h1>Zunou strategy — vote admin</h1>
<p class="meta">Signed in as <code>${escapeHtml(email)}</code> · <strong>${records.length}</strong> total reactions from <strong>${users.length}</strong> user${users.length === 1 ? "" : "s"}.</p>

<h2>By decision</h2>
${decisions.length === 0 ? '<p class="empty">No votes yet.</p>' : `
<table>
  <thead>
    <tr>
      <th style="width:5rem">Decision</th>
      <th><span class="pill pill-green">On board</span></th>
      <th><span class="pill pill-amber">Concern</span></th>
      <th><span class="pill pill-red">Object</span></th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    ${decisions
      .map((d) => {
        const t = tally[d];
        const total = t["on-board"] + t.concern + t.object;
        return `<tr><td><code>${d}</code></td><td class="num">${t["on-board"]}</td><td class="num">${t.concern}</td><td class="num">${t.object}</td><td class="num"><strong>${total}</strong></td></tr>`;
      })
      .join("")}
  </tbody>
</table>`}

<h2>By person</h2>
${users.length === 0 ? '<p class="empty">No reactions yet.</p>' : `
<table>
  <thead>
    <tr>
      <th>User</th>
      ${Array.from({ length: 17 }, (_, i) => `<th style="text-align:center"><code>d${i + 1}</code></th>`).join("")}
    </tr>
  </thead>
  <tbody>
    ${users
      .map((u) => {
        const votes = byUser[u];
        return `<tr><td>${escapeHtml(u)}</td>${Array.from({ length: 17 }, (_, i) => {
          const dId = `d${i + 1}`;
          return `<td class="num">${votes[dId] ? vDot(votes[dId]) : "·"}</td>`;
        }).join("")}</tr>`;
      })
      .join("")}
  </tbody>
</table>`}

<p class="meta" style="margin-top:3rem">Updated live. Refresh for current state. 🟢 = on board · 🟡 = concern · 🔴 = object · · = no vote.</p>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};
