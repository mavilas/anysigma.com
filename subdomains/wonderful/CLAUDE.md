# CLAUDE.md

Standing brief is in [`AGENTS.md`](./AGENTS.md). Read it before doing anything in this repo.

## Claude Code specifics

- Prefer `Edit` over `Write` for incremental changes — only `Write` when creating a new file.
- Batch independent tool calls in a single message (e.g. parallel reads of multiple components).
- Don't run `pnpm dev` in the foreground from Bash — start it with `run_in_background: true` if you need it, otherwise just `pnpm build` to verify.
- This repo is **static-only**. If the user asks for something that would need a server runtime, surface that constraint before writing code.
- When generating new mini-site content, follow the story-arc patterns documented in [`product.md`](./product.md).
- Design invariants in [`design.md`](./design.md) are not negotiable without explicit user permission.

## Presentation decks (added 2026-06-03)

This repo now hosts a Reveal.js deck at `/launch-plan/present` alongside the reader-friendly mini-site at `/launch-plan`. Both render from the same data file `src/data/launch-plan.ts`.

**Canonical design system for decks + readers**: `wonderful-ai/docs/analysis/deck-recipes.md`. Nine hard gates including minimum font sizes (14 px deck floor / 13 px reader floor), pixel-perfect render gate, SVG math consistency, tone alternation, and pattern-locked layouts (hero numbers row + 2-column evidence grid). Read this before adding or editing any slide.

**Pattern to follow when adding a new slide-bearing route**:
1. Add data to `src/data/<page>.ts` (one constant per content block, with sources cross-checked against primary docs).
2. Render reader-friendly version in `src/pages/<page>.astro` using `Section` component.
3. Render deck version in `src/pages/<page>/present.astro` using Reveal.js section markup with palette CSS variables that mirror the reader palette.
4. Verify with Chrome headless: capture every slide at 1280×720 and audit against the recipe gates before merge.
5. Add a "Last synced" footnote on the reader that points at the data file.

## Deploy discipline — non-negotiable

If this mini-site lives as a subdirectory of a parent repo (the `<parent>.com/subdomains/<slug>/` pattern), the deploy is **manual** via `wrangler pages deploy`, not git-auto. Three rules:

1. **Always run `pwd` before deploying.** The working dir must end in the subdomain folder, never the parent root. Tools like Bash persist working dirs across commands, but model sessions reset them — verify every time.
2. **Always run `pnpm run deploy:check` before `wrangler pages deploy`.** The script prints `dist/index.html` title + cwd. If they look wrong, do not upload. (`pnpm run deploy` does both in sequence — prefer that.)
3. **The Cloudflare Pages project name** is set on Cloudflare side and passed via `--project-name=<exact-cf-name>`. The `name` field in `wrangler.toml` is decorative for Pages. To see the actual project name: `pnpm wrangler pages project list`.

The "deployed the parent's coming-soon page to the mini-site's Pages project" bug **has happened**. The `deploy:check` script exists specifically to prevent it from happening again. See [`RECIPE-NEW-SUBDOMAIN.md`](./RECIPE-NEW-SUBDOMAIN.md) → Troubleshooting.

## After a major content push

Tell the user, in order:
1. The deploy ID (from wrangler output) — e.g. `Deployment complete! https://<hash>.<project>.pages.dev`
2. The custom-domain URL where they can verify
3. Any auth gotchas (Cloudflare Access cookie may need clearing if the policy changed)

If a previous PR was squash-merged to main and you push more commits on the same feat branch, **don't `git rebase` onto main** — the squash commit's hash differs from the feat branch's history and you'll get phantom conflicts. Instead: `git reset --soft origin/main`, re-commit the diff as one commit, force-push, open a fresh PR. See `RECIPE-NEW-SUBDOMAIN.md` troubleshooting.
