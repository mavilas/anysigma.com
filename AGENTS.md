# AGENTS.md — shared brief for `*.anysigma.com` subdomains

You're working in the `anysigma.com` monorepo. Each subdirectory under `subdomains/` is its own Astro mini-site deployed to a Cloudflare Pages project gated by Cloudflare Access.

## Per-subdomain briefs

Each subdomain has its own `AGENTS.md` (and often `CLAUDE.md`) inside `subdomains/<slug>/`. Read that first for stack and conventions specific to the site you're touching.

## Canonical design system

For any visual work — mini-site sections, presentation decks, charts, SVGs — the binding rules live in:

📘 **`/Users/mavila/github/personal/wonderful-ai/docs/analysis/deck-recipes.md`**

That document is the single source of truth for typography minimums, slide layout gates, color hierarchy, tone alternation, SVG math, and headless-Chrome verification. Read it before adding or editing any visual element.

The short version of the rules every subdomain enforces:

### Typography minimums (hard floor)

- Deck (16:9 Reveal.js): 14 px absolute floor. H2 52 px, body 17 px, source citation 12 px italic mono
- Reader (scrolling mini-site): 13 px absolute floor. H2 40–56 px, body 16 px, source 12 px
- SVG annotations: render to actual pixels by `viewBox_unit × (rendered_size / viewBox_size)`. If the SVG is 100×100 viewBox rendered at 200 px wide, `font-size="7"` reads as 14 actual px. Always compute the rendered size, never trust the SVG number alone.

### Color hierarchy ladder

Every multi-tier visual (pyramid, funnel, gantt, donut, table, card grid) places each element on one of three rungs:

| Rung | Role | Color token | Where used |
|---|---|---|---|
| **HIGH** | "The wins / headline / target" | `--color-accent` (Wonderful blue `#2851ff`) **or** `--color-highlight` (cobalt `#0ba5ff`) for stat numbers | Pyramid top, funnel destination, table header, hero stat, load-bearing keyword |
| **MID** | "Supporting evidence" | `--color-accent-soft` (tinted) **or** track colors (plum `#7a5cff` / emerald `#0b8f6b` / coral `#d9594c` / amber `#d99c2e`) | Middle tiers, body cards, named tracks |
| **LOW** | "Context / universe / background" | `--color-paper-soft` / `--color-paper-warm` fill, `--color-ink-soft` border, `--color-ink-faint` text | Pyramid base, funnel universe row, faded gantt rows, source citations |

**Visual gravity rules**:
1. The HIGH rung sits where the eye lands first (pyramid top, funnel bottom, table header row).
2. Never give two rungs the same emphasis — the brain reads them as parallel, not hierarchical.
3. Direction of emphasis is consistent within a single visual (pyramids: vivid top → fading down; funnels: faded top → vivid bottom).
4. HIGH rung must contrast strongly with the slide background. Blue accent on blue-tinted bg = forbidden (see Gate 10 in deck-recipes.md).

**Forbidden patterns**:
- ❌ Vivid accent in middle tier with neutral top tier. Inverts hierarchy.
- ❌ Three+ rungs in the same hue family. Reads as one shape.
- ❌ `--color-accent-ink` (deepest blue) as a tier fill. Reads as ink, not accent. Reserve for hover and shadow.
- ❌ Track colors on non-tracked elements. Track colors are explicit-track-only.

### Slide tone alternation (decks only)

Walk the deck and alternate cleanly: `paper / soft / warm / paper / soft / warm / ink (rare)`. Never three same-tone slides in a row. Mist tone is forbidden when any blue-family accent appears in the visual.

### Shared data + dual-render pattern

When a mini-site has a partner Reveal deck (`/slug/present`):
- Single source of truth = `src/data/<slug>.ts`. Every load-bearing number lives there with primary-source citation.
- Reader renders via `src/pages/<slug>.astro` using `Section.astro`.
- Deck renders via `src/pages/<slug>/present.astro` using Reveal `<section>` markup.
- Inline color strings in data MUST resolve in both contexts. If `var(--color-accent)` is used in the data file, the deck's inline `<style>` must declare it. Undefined CSS vars silently fall back to `currentColor` and SVG segments disappear without throwing.

### Reader → Deck button label (universal)

When a mini-site reader has a partner deck at `/<slug>/present`, the button on the reader uses one canonical label:

> **Open the presentation**

No variants ("Present deck", "View slides", "Launch deck"). Same wording on every subdomain so the affordance is recognisable across sites. Opens in a new tab (`target="_blank" rel="noopener"`). Sits next to the primary "Read the plan" / "Read the brief" CTA, styled as the secondary action (outlined, not filled).

### Source citation anchor (decks)

Every slide that cites a source uses ONE source pill, anchored bottom-right of the slide:

```css
.reveal p.source {
  position: absolute;
  bottom: 14px;
  right: 80px;   /* clear of Reveal's nav-arrow chevron */
  left: 56px;
  text-align: right;
  color: var(--ink-soft);
  opacity: 0.78;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  font-style: italic;
  z-index: 3;
}
.reveal .slides section { padding: 48px 56px 56px; }  /* reserve the bottom strip */
```

Rules (codified after 2026-06-03 sweep):
- **Never in flex flow.** Flex flow lets growing grids (`flex: 1`) leak into the strip and overlap the text.
- **Never nested inside a card.** One section-level pill; no duplicate inside `.chart-card` or similar.
- **Never `border-top` on the pill.** A horizontal line crashes through any card/grid item that extends below its row.
- **Never `var(--ink-faint)`.** Too pale on cream/warm tones. Use `--ink-soft` at 0.78 opacity.
- **Bottom strip is reserved.** Section padding-bottom ≥ 56 px. Confirm no `.cards-3` / `.japan-grid` / `.two-col` child extends past that strip in Chrome headless capture.

### Verification recipe

After any visual change:
1. `pnpm build`
2. Render via headless Chrome at the target viewport (1280×720 for deck, desktop width for reader)
3. Squint at the slide from 2 m back. Name aloud which element is HIGH, MID, LOW. If the wrong element grabs your eye, the color rungs are wrong.
4. Grep the rendered DOM for `var(--color-` in `stroke=` / `fill=`. If found AND the shape looks off, the variable isn't defined in this context — add the alias.

## Deploy discipline

Each subdomain has its own `deploy:check` script. The pattern is non-negotiable:
1. `pwd` — must end in `subdomains/<slug>`
2. `pnpm run deploy:check` — confirms `dist/<landing>/index.html` title, cwd, and `public/_redirects`
3. `pnpm wrangler pages deploy dist --project-name=<exact-cf-name> --branch=main`

CF Pages project names are set on Cloudflare side and passed via `--project-name`. The `name` field in `wrangler.toml` is decorative.

## When in doubt

Read `wonderful-ai/docs/analysis/deck-recipes.md`. It has 11 hard gates with verification recipes for each. The rules there govern every subdomain in this repo.
