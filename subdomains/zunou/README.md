# zunou.anysigma.com — security test placeholder

Self-contained Astro project that deploys to `zunou.anysigma.com`. Currently a minimal placeholder for **verifying Cloudflare Access works correctly** before the real Zunou strategy mini-site lands here.

---

## Stack

Matches the rest of the `anysigma.com` repo:

- Astro 6
- Tailwind CSS v4 (Vite plugin)
- Lucide icons (`@lucide/astro`)
- pnpm
- Wrangler (Cloudflare Pages output)

The folder is self-contained: its own `package.json`, `astro.config.mjs`, `wrangler.toml`, and `dist/` — no dependency on the apex project's `node_modules`. Each subdomain is independent.

---

## Run locally

```bash
cd subdomains/zunou
pnpm install
pnpm dev    # http://localhost:4321
```

Build:

```bash
pnpm build
pnpm preview
```

Deploy (after Cloudflare Pages project + Access policy are set up — see `DEPLOY.md`):

```bash
pnpm deploy
```

---

## What's the test for?

Before we pour the real Zunou strategy content into this subdomain, we want to confirm three things:

1. **Cloudflare Access correctly gates the subdomain** — unauthenticated visitors get the login wall, not the content.
2. **The allowlist works** — emails on the policy can log in (via magic-link), emails not on the policy get blocked.
3. **The session policy is right** — 14-day session, renews on activity.

The placeholder page shows a "you're in" message so a successful auth is visually unambiguous.

See `DEPLOY.md` for the step-by-step Cloudflare setup.

---

## After the test passes

This folder gets replaced with the real Zunou strategy mini-site (single-page Astro built from the research markdown in `mavilas/zunou`). The auth + deploy infrastructure stays — only the content changes.

---

## When you add a new client subdomain (e.g. `client-x.anysigma.com`)

1. `cp -r subdomains/zunou subdomains/client-x`
2. Update `subdomains/client-x/wrangler.toml` → `name = "client-x-anysigma-com"`
3. Update `subdomains/client-x/astro.config.mjs` → `site: "https://client-x.anysigma.com"`
4. Replace `src/pages/index.astro` content
5. Cloudflare Pages: new project pointing at `subdomains/client-x/`
6. Cloudflare Access: new application + policy for `client-x.anysigma.com`

Each subdomain is independent: own deploy, own Access policy, own allowlist. Zero cross-tenant leakage by design.
