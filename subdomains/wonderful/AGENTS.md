# AGENTS.md — brief for AI assistants

You're working in (or in a repo copied from) `mavilas/mini-site-boilerplate` — a starter for `*.anysigma.com` mini-sites.

## What this repo is

A static Astro 6 site, single-page by default, deployed to Cloudflare Pages and gated by Cloudflare Access. Each mini-site is a single-page narrative for a small stakeholder audience — typically a strategy proposal, internal memo, or briefing the team is supposed to read and react to.

## Stack (non-negotiable)

- Astro 6 — server-rendered static output, no runtime
- Tailwind CSS v4 via `@tailwindcss/vite` — theming lives in `src/styles/tailwind.css` (`@theme` block); there is **no** `tailwind.config.js`
- `@lucide/astro` — named imports only, tree-shaken at build time
- pnpm 10, Node 22+
- Wrangler 4 — `pages_build_output_dir = "dist"`
- TypeScript strict mode

If a request would add a runtime dependency (React, Vue, htmx, Alpine, etc.), push back. The whole point of the boilerplate is that it stays static.

## Design invariants

Spelled out in `design.md`. The short version:

- **OKLCH palette** with a swappable accent (`src/styles/palettes/*.css`). Five presets ship: warm-orange, cool-blue, forest-green, slate, plum.
- **Typography:** Instrument Serif for display, Inter for body, JetBrains Mono for code/labels. Japanese fallbacks built in.
- **No gradient hero backgrounds.** Subtle grain only.
- **No dark-mode toggle by default.** These docs are read in daylight by execs.
- **Animation:** reveal-on-scroll for content (`data-reveal`), small hover micro-interactions on tiles, and `prefers-reduced-motion` always wins.

## Component conventions

- Components in `src/components/` take **structural props only** — no project-specific defaults baked in.
- Defaults that are content (placeholder copy, example data) live in `src/pages/index.astro`, not in the component.
- Icons: pass as kebab-case strings (e.g. `icon="trending-up"`), the component converts to PascalCase and looks up in `@lucide/astro`. Type-safe and tree-shaken.
- Animation hooks: add `data-reveal="fade-up"` (default), `"scale"`, or `"left"` plus `data-reveal-delay={n}` for stagger.

## How to add a new component

1. Drop a `.astro` file into `src/components/`.
2. Props in `interface Props {}`, destructure with defaults.
3. If it animates on scroll, add `data-reveal` + optional `data-reveal-delay`.
4. Demo it in `src/pages/index.astro` so future copy-pasters see it.

## Deploy pattern (summary — full runbook in `DEPLOY.md`)

1. Cloudflare Pages project, connect to Git repo, build command `pnpm install --frozen-lockfile=false && pnpm build`, output `dist`.
2. Add custom domain `<your-subdomain>.anysigma.com`. If the CNAME doesn't auto-create, add it manually (this was an issue with the source Zunou deploy — make it explicit).
3. Cloudflare Access (Zero Trust) → self-hosted app on the subdomain → magic-link IdP → policy with email or domain rules → 14-day session.
4. Verify against the 5-test isolation matrix in `DEPLOY.md`.

## Things you should NOT do

- ❌ Add React, Vue, Svelte, htmx, Alpine, or any other client-side framework
- ❌ Add gradient hero backgrounds (we use grain instead — see `design.md`)
- ❌ Auto-translate Japanese content from English in demo or production pages. If a section is in Japanese, write Japanese; if English, English. Translation memory belongs to the human author.
- ❌ Link to private GitHub repos or other private resources from stakeholder-facing pages (the page may be screenshot-shared)
- ❌ Introduce a `tailwind.config.js`. Tailwind v4 is CSS-first.
- ❌ Skip the `prefers-reduced-motion` guard when adding animation
- ❌ Use `--no-verify`, `--force` push, or amend already-pushed commits

## Repo conventions

- Branch + PR for all non-trivial changes — don't push to `main` directly
- Commit messages: imperative mood, concise, with a `Why:` line when the change isn't self-evident from the diff
- Verify `pnpm build` succeeds before opening the PR
