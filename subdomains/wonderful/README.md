# mini-site-boilerplate

A ready-to-copy Astro 6 + Tailwind v4 starter for spinning up new mini-sites under `*.anysigma.com`. Copy → swap content + one accent line → deploy to Cloudflare Pages → attach Cloudflare Access. ~30 minutes per site.

The patterns here are extracted from the production [`zunou.anysigma.com`](https://github.com/mavilas/anysigma.com) mini-site — they've been debugged through real deployment. Don't reinvent.

---

## Quick start

```bash
# 1. Use as a GitHub template (recommended)
gh repo create mavilas/my-new-mini-site --template mavilas/mini-site-boilerplate --private --clone

# Or clone directly:
# git clone https://github.com/mavilas/mini-site-boilerplate my-new-mini-site

cd my-new-mini-site
pnpm install

# 2. Pick an accent palette
#    Edit src/styles/tailwind.css → change one @import line.
#    Options: warm-orange · cool-blue · forest-green · slate · plum

# 3. Update wrangler.toml — change `name` to your project's slug
#    (e.g. "my-new-mini-site")

# 4. Swap demo content in src/pages/index.astro for your real content

# 5. Run locally
pnpm dev   # http://localhost:4321

# 6. Build
pnpm build

# 7. Deploy + attach Cloudflare Access — follow DEPLOY.md
```

---

## What's in the box

| | |
|---|---|
| **Stack** | Astro 6, Tailwind v4 (via `@tailwindcss/vite`), `@lucide/astro`, pnpm 10, Wrangler 4. No client-side JS frameworks. |
| **Design** | OKLCH editorial palette · Instrument Serif display · Inter body · grain background · `prefers-reduced-motion` respected. |
| **Components** | `Section`, `Stat`, `CaseStudy`, `Decision`, `Community`, `Quote`, `Timeline`, `Faq`, `Cta`. |
| **Animations** | `data-reveal` IntersectionObserver baked into `Layout.astro`; `tile` hover lift; `arrow-pop` micro-interaction. |
| **Deploy** | Cloudflare Pages + Cloudflare Access (magic-link email, 14-day session) — see `DEPLOY.md`. |

---

## Docs

- [`AGENTS.md`](./AGENTS.md) — standing brief for AI assistants working in this repo
- [`CLAUDE.md`](./CLAUDE.md) — Claude Code specifics (incl. deploy-discipline rules)
- [`design.md`](./design.md) — design system rationale (typography, color, animation)
- [`product.md`](./product.md) — content patterns: story arcs and sections that convert
- [`DEPLOY.md`](./DEPLOY.md) — Cloudflare Pages + Access runbook (Path A · git auto-deploy · Path B · manual wrangler)
- [`RECIPE-NEW-SUBDOMAIN.md`](./RECIPE-NEW-SUBDOMAIN.md) — generalized recipe for adding `<slug>.<parent>.com` to ANY parent domain

---

## License

Private. Internal use only.
