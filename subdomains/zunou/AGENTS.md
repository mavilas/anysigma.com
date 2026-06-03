# `zunou.anysigma.com` — agent conventions

Process documentation for anyone (human or agent) working in `subdomains/zunou/`. Keep these conventions stable so the site stays coherent as pages are added.

## Information architecture — the four pillars

The site is organized around four sibling top-level pages. Every page is one of these pillars; new content goes inside an existing pillar or is held in a sub-page.

| Pillar | Page | Role |
|---|---|---|
| **GTM** | `src/pages/index.astro` | The market plan. Names the destination. |
| **Journeys** | `src/pages/journeys.astro` | The user lens. Shows where users drop. |
| **Foundation** | `src/pages/foundation.astro` | The engineering work. Builds what GTM stands on. |
| **Quality** | `src/pages/quality.astro` | The test contract. Keeps the foundation standing. |
| **Pilots** | `src/pages/pilots/index.astro` + `src/pages/pilots/<partner>/` | Per-partner sales prep + customer deck. One folder per pilot. |

The banner on every page reads: **"GTM names it · Journeys shows it · Foundation builds it · Quality verifies it."** Do not break that ordering or rephrase it without a deliberate reason.

`src/pages/scan.astro` is a deprecated legacy of an earlier "90-second scan" pattern that was folded into the per-page Executive Summary block. Leave it in place for backwards-compat; do not link to it from new content.

## Page structure — every pillar follows the same skeleton

Top to bottom on every full pillar page:

1. **Top banner** (`<div class="border-b border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)]/60">`) — eyebrow label + the four-pillar tagline + cross-page links on the right
2. **Hero** — eyebrow chip with page icon + author/date stamp + two-line `<h1>` with italic emphasis on line two + lede paragraph
3. **Headline thesis block** (optional) — `border-2 border-accent` callout with "The principle" eyebrow, one display-font sentence, one short paragraph
4. **Anchor stats** — 4 `.stat-xl` cards in a 2x2 (mobile) / 1x4 (desktop) grid
5. **Executive Summary** — `.exec-summary` block with id `exec-summary` (see "Executive Summary contract" below)
6. **Sections** — numbered §01, §02, … using `.section-number` badge + eyebrow text + `<h2>` display title + lede + content. Alternate background tones between sections using `bg-[var(--color-paper-soft)]` for visual rhythm
7. **Closing** — dark `bg-[var(--color-ink)]` section with a final synthesis, an italic display-font line on a top border, and (where appropriate) cross-page CTAs to the other pillars

## Executive Summary contract

Every page must have an `.exec-summary` block with `id="exec-summary"`. The shape is fixed:

- Numbered list of 4–6 bullets (`<ol class="exec-summary-list">`)
- Each bullet leads with a `<strong>` clause stating the takeaway, followed by the explanation
- Header: `Executive summary` eyebrow + a meta hint (e.g., `5 bullets · 60 seconds`)
- The first agenda item is always `{ id: "exec-summary", label: "Executive summary", icon: "list" }`

Styles live in `src/styles/tailwind.css` under `=== Executive summary ===`. Do not invent new visual treatments for top-of-page summaries.

## Agenda (left rail)

Every page passes an `agenda` prop to `<Layout>`:

```astro
<Layout
  title="..."
  agenda={[
    { id: "exec-summary", label: "Executive summary", icon: "list" },
    { id: "section-id-1", label: "Section name", icon: "lucide-kebab-name" },
    ...
  ]}
>
```

- The agenda renders only at `xl` breakpoints (≥1280px). Mobile/tablet hide it; the content stays full-width.
- Active-section highlighting is driven by `IntersectionObserver` in `src/components/Agenda.astro`. Section anchors must use `id="..."` on the wrapping `<section>` to be detected.
- Icons are lucide names in kebab-case (`list`, `key-round`, `circle-dot`). They resolve via `@lucide/astro` inside the component.
- Aim for 6–10 agenda items per page. Long pages should pick the spine, not every sub-section.

## Visual system

**Read the canonical brief first.** The visual discipline (typography minimums, color hierarchy, slide gates, source-pill anchoring, SVG math, headless-Chrome verification) lives at:

📘 **`../../AGENTS.md`** at the apex of the anysigma.com repo (universal subdomain rules) → which itself points to →
📘 **`../../docs/deck-recipes.md`** at the apex of the anysigma.com repo (canonical visual-discipline doc, 11+ hard gates) — applies to **every subdomain in the anysigma family**, not just Zunou.
📘 **`../../docs/recipes/visual-discipline.md`** — reader-page addendum (hero stack, section rhythm, container width).

Zunou-specific palette notes at [`docs/recipes/colors.md`](docs/recipes/colors.md). Anything below this header is a short-form summary; the canonical brief is the source of truth.

### Icons
- Only `@lucide/astro` icons. No emoji, no SVG inlining, no other icon packs.
- Import what you use at the top of the page. Avoid `import * as Icons from "@lucide/astro"` patterns in pages — they balloon bundle size.

### Colors (short form — see recipe for the full rules)
Defined in `src/styles/tailwind.css` under `@theme`. Use the CSS variables, not raw hex:
- `--color-ink` / `--color-ink-soft` / `--color-ink-faint` — text
- `--color-paper` / `--color-paper-soft` / `--color-paper-warm` — surfaces
- `--color-line` / `--color-line-soft` — borders
- `--color-accent` (`#4A00E0`) / `--color-accent-soft` / `--color-accent-ink` — Zunou brand purple
- `--color-success` / `--color-warning` / `--color-danger` — semantic, each with `-soft` companions

**Hard rules** (per the apex recipe):
- One accent (Zunou purple), neutrals everywhere else. No second accent.
- Semantic colors (`warning` / `danger` / `success`) are for **true operational state only**, never decoration.
- Placeholders / TODOs use `border-dashed border-line` + `text-ink-soft`. No color.
- At most one `border-2 border-accent` emphasis card per page.

### Alignment and consistency (short form — see recipe)
- Container: `max-w-6xl mx-auto px-6` (full pages) or `max-w-4xl` (scan-style). One per page.
- Section rhythm: `py-16 sm:py-20` (full) or `py-10` (scan). One per page.
- Inner prose: `max-w-3xl`.
- Eyebrow tracking: `tracking-[0.18em]`. One canonical value.
- Card grids: every card in one grid shares padding + border weight + rounding + background.
- Left-align prose by default. `text-center` only in footer signature and hero stat figures.

### Typography
- **Display** (`font-display`, Bree Serif): page H1, section H2, large stat figures, magic numbers
- **Sans** (default, Bricolage Grotesque): body, leads, cards
- **Mono** (JetBrains Mono): eyebrows, file:line citations, ROI stars, timestamps, durations

### Animation philosophy
- Use the `data-reveal="fade-up"` + `data-reveal-delay={n}` pattern handled by the `IntersectionObserver` in `Layout.astro`. Each unit of delay = 80ms.
- For staggered list children (e.g., journey steps), apply `data-reveal` per-child with sequential delays capped at 5 to avoid long compound waits.
- Hover-lift cards use `transform: translateY(-2px) scale(1.012)` with `box-shadow` shadow expansion. Use the `.stat-xl:hover` pattern as the template.
- Honor `prefers-reduced-motion`: the media query at the bottom of `tailwind.css` zeroes out animations and reveal transforms.

## Adding a new pilot

The `/pilots/*` family follows a strict two-URL convention per partner:

- `/pilots/<partner>` — **internal prep doc** (`src/pages/pilots/<partner>.astro`). What Marco + Malek read before the meeting. Honest, action-oriented, with file:line cross-refs to Foundation Tier-1 + Journeys.
- `/pilots/<partner>/deck` — **customer-facing deck** (`src/pages/pilots/<partner>/deck.astro`). What we screen-share with the partner. Visual-first, less internal jargon, deck-style slides with mockup zones.

When adding a new pilot:
1. Drop a row into the `pilots: Pilot[]` array at the top of `src/pages/pilots/index.astro` (status, beachhead, geo, why, prepUrl, deckUrl, nextAction).
2. Copy `src/pages/pilots/indelible.astro` as the prep template.
3. Copy `src/pages/pilots/indelible/deck.astro` as the deck template.
4. Cross-link from GTM (the relevant Phase) so the partner shows up where the strategy lives.

Both prep and deck honor the standard skeleton (banner · hero · exec summary · numbered sections · closing) but the deck uses bigger type, more whitespace (`.deck-slide` ≈ 7rem padding), and visual mockup zones (`.deck-mockup-frame`).

## Agenda visibility

The Agenda component renders on every page that passes a non-empty `agenda` prop:
- **lg+ (≥1024px):** sticky left sidebar (was xl-only before; lowered so most laptops show it).
- **lg-but-narrow (1024–1279px):** sidebar tightens to 11rem flush left.
- **Below lg:** horizontal scrollable pill bar sticky below the main nav, with active chip auto-scrolling into view.

Both presentations share IntersectionObserver active-section tracking + smooth-scroll click handlers.

## Adding a new page

1. Decide which pillar it belongs to. If it doesn't fit, the four-pillar architecture is the problem — propose a change to AGENTS.md before adding a fifth pillar.
2. Sub-pages live under the pillar's URL space (e.g., `/foundation/notifications`) and reuse the same Layout, agenda, banner, and closing patterns.
3. Always include an Executive Summary block — even a 3-bullet one.
4. Update every sibling page's nav banner if the new page is a top-level addition.

## Deployment

`zunou.anysigma.com` deploys via Cloudflare Pages from the `mavilas/anysigma.com` repo. Build settings are documented in `DEPLOY.md`. Behind Cloudflare Access (14-day session, magic-link allow list).

The `subdomains/zunou/` folder is self-contained — its own `package.json`, `astro.config.mjs`, `wrangler.toml`, `dist/`. Do not introduce dependencies on the apex project's `node_modules`.

Local dev:
```
cd subdomains/zunou
pnpm install
pnpm dev   # http://localhost:4321
```

## When in doubt

- **More restraint, not more decoration.** The site is a working document, not a marketing splash. Every flourish needs to earn its place.
- **Cite specifics.** Bugs and recommendations should always have file:line evidence on the page. Vague claims weaken the rest of the document.
- **Keep page sections numbered.** §01, §02, §03 — readers use them as references in meetings.
- **Don't break the banner ordering.** GTM · Journeys · Foundation · Quality is read left-to-right as a sequence; reordering it confuses the reader's mental model.
