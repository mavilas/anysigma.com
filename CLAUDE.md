# CLAUDE.md — apex of `anysigma.com` monorepo

Standing brief lives in **[`AGENTS.md`](./AGENTS.md)**. Read it before doing anything in this repo.

## Canonical visual-discipline recipe (mandatory)

For any visual work in **any subdomain** (Zunou, Wonderful, IVS, future), the binding rules are:

📘 **[`docs/deck-recipes.md`](./docs/deck-recipes.md)** — 13 hard gates at the top: source-pill anchored bottom-right, one source per slide, ≤160 char source budget, no card extends past source strip, slide-tone vs accent never same family, HIGH rung first, multi-visual alignment, cards size to content, shared-data CSS vars aliased, deck matches reader narrative, headless-Chrome verification, nav controls + slide counter pinned, "Open the presentation" button label. Read first.

📘 **[`docs/recipes/visual-discipline.md`](./docs/recipes/visual-discipline.md)** — reader-page addendum (hero stack, section header shape, container width, card-grid consistency).

These two documents apply to every subdomain under `subdomains/`. Per-subdomain `AGENTS.md` files defer to them and may only add subdomain-specific tokens (e.g. brand palette).

## Per-subdomain briefs

Each subdomain has its own `AGENTS.md` (and sometimes `CLAUDE.md`) inside `subdomains/<slug>/`. Read that next for stack and conventions specific to the site you're touching.

## Claude Code specifics

- Prefer `Edit` over `Write` for incremental changes — only `Write` when creating a new file.
- Batch independent tool calls in a single message (e.g. parallel reads of multiple components).
- Don't run `pnpm dev` in the foreground from Bash — start it with `run_in_background: true` if you need it, otherwise just `pnpm build` to verify.
- Each subdomain is **static-only**. If the user asks for something that would need a server runtime, surface that constraint before writing code.
- When generating new mini-site content or slide-bearing routes, follow the data-flow pattern documented in `docs/deck-recipes.md` (single `src/data/<page>.ts` source of truth, reader at `src/pages/<page>.astro`, deck at `src/pages/<page>/present.astro`).
- Every claim with a number needs a primary-source citation in the data file.

## Verification before merging visual work

1. Render via headless Chrome at the target viewport (1280×720 for deck, desktop width for reader)
2. Run the deck audit (`/tmp/zunou-audit.mjs` or equivalent) to check gates programmatically
3. Squint at the slide from 2 m back. If any element is wrong-hierarchy or unreadable, the recipe is being violated

## Deploy discipline

Each subdomain has its own `deploy:check` script. The pattern is non-negotiable:
1. `pwd` — must end in `subdomains/<slug>`
2. `pnpm run deploy:check` — confirms `dist/<landing>/index.html` title, cwd, and `public/_redirects`
3. `pnpm wrangler pages deploy dist --project-name=<exact-cf-name> --branch=main`

CF Pages project names are set on Cloudflare side and passed via `--project-name`. The `name` field in `wrangler.toml` is decorative.

## When in doubt

Read **[`docs/deck-recipes.md`](./docs/deck-recipes.md)**. It has hard gates with verification recipes. The rules there govern every subdomain.
