# Wonderful · Launch deck + reader recipes (canonical)

Two modes, one source of truth (`src/data/launch-plan.ts`). Different scaling rules.

## Hard gates — quick reference (top of doc, read first)

These are the gates that, if violated, fail a slide regardless of content quality:

1. **Source pill is anchored bottom-right of the slide, NEVER in flex flow.**
   - `position: absolute; bottom: 14px; right: 80px; left: 56px; text-align: right;`
   - Section reserves `padding: 48px 56px 56px` so growing grids cannot leak into the source strip.
   - Color: `var(--ink-soft)` at `opacity: 0.78`. Italic JetBrains Mono 11 px. NOT `--ink-faint` (too pale to read on cream).
   - No `border-top` — italic + faded tone is the separator. A border line crashes through any grid item that extends below its row.
   - Right inset (`right: 80px`) keeps the text-end clear of Reveal's nav-arrow chevron column.
2. **One source per slide. Never nested inside a card AND repeated at section level.** Consolidate to one `<p class="source">` directly under `<aside class="notes">`.
3. **Source line ≤ 160 chars.** Truncate URL anchor text. Use middle dots `·`, never `,`.
4. **No element extends below the source pill's reserved strip.** If a grid uses `flex: 1`, it must respect `min-height: 0` and the section's bottom padding. Verify with headless Chrome at 1280×720 before merge.
5. **Slide tone vs accent hue: never same-family.** Blue accent on blue-mist bg = forbidden. Use `paper` / `soft` / `warm` / `ink`.
6. **HIGH rung sits where the eye lands first.** Pyramid top = vivid accent. Funnel destination = vivid. Pyramid base = `--paper` with `--ink-soft` stroke (LOW rung).
7. **Multi-visual 2-col slides align eye-to-eye.** `.two-col { align-items: center !important }`.
8. **Cards size to content, not slide.** `.cards-3 { flex: 0 0 auto }` — sparse cards must not be stretched. Use a top anchor (big numeric, eyebrow) when content is sparse, never floating-center text.
9. **CSS variables used in shared data must be aliased in the deck context.** `--color-accent` and `--accent` must both resolve. Undefined vars silently fall back to `currentColor` and SVG segments vanish.
10. **Deck visuals MUST match the mini-site narrative.** Same time periods, same parallelism story. Visual treatment may differ; data must not.
11. **Verification before merge.** Run `pnpm build`, then headless Chrome capture all 18 slides at 1280×720, eyeball every one. Squint test from 2 m: name aloud which element is HIGH / MID / LOW. If the wrong thing grabs the eye, fix before deploy.
12. **Reveal nav arrows + slide counter are PINNED**, never floating. `.reveal .controls { right: 12px; bottom: 12px; }` and `.reveal .slide-number { right: 14px; bottom: 6px; background: rgba(15,23,42,0.6); color: #fff; }`. Same position on every slide — readers learn the affordance once.
13. **Reader → Deck button label is universal: "Open the presentation".** Never "Present deck", "View slides", "Launch deck". Same label on every subdomain. Opens in a new tab. Secondary action style (outlined), sits next to the primary "Read the plan" CTA.

Detailed rationale + recipes for each gate appears later in the doc.

---

## Mode 1 · Reader (mini-site at `/launch-plan`)

**Purpose**: pre-read, share-by-link, scan in the browser, source URLs visible inline. Scrolling layout. Generous whitespace is fine — the reader controls pace.

| Element | Reader scale |
|---|---|
| Section eyebrow | 14 px, mono, accent, tracking 0.18em |
| Section title (h2) | 40–56 px, Bree Serif, navy |
| Lede | 18–20 px, body |
| Body | 16 px, leading 1.55 |
| Stat number | 56–80 px, cobalt |
| Card title | 20 px, navy, semibold |
| Source line | 12 px, mono italic, faint |

**Reader rules**
- Sections flow naturally; no forced 16:9; no `overflow: hidden`.
- One H2 per section. Eyebrow above it always.
- Cards may be tall (300–500 px). Whitespace between cards is OK; whitespace at the bottom of a section is fine.
- Hyperlinks remain blue and underlined.
- Source citations sit at the section foot, with `https://…` URLs visible (this is a reader, not a deck).
- A4-portrait print CSS is the natural "save as PDF" output. Not used as the presentation deck.

## Mode 2 · Deck (Reveal.js at `/launch-plan/present`)

**Purpose**: HQ presentation. 16:9 (1280×720). Hosoi controls pace; the audience reads from a projector. Density and color carry the slide; whitespace below content is forbidden.

### Universal slide rules

1. **Fill the slide**. Every content area must reach within 24 px of the bottom safe edge. No "band of paper" at the bottom of a slide. Either grow the visual or add a callout strip.
2. **One headline per slide**. The h2 is the load-bearing claim. If the slide has two ideas, it's two slides.
3. **Eyebrow + title + lede sit in the top 25%**. Content fills the remaining 75%.
4. **Source line bottom-pinned**. `margin-top: auto` so it floats to the safe edge.
5. **Top 6 px accent strip** on every slide for visual continuity.
6. **Speaker notes** mandatory. One short paragraph per slide.

### Typography scale (deck)

Bigger than reader. Projector distance matters.

| Element | Deck scale |
|---|---|
| Eyebrow | 14–16 px mono caps, accent, tracking 0.18em |
| Title (h2) | 52 px Bree Serif, navy (62 px for title slide h1) |
| Lede | 22 px, body, max 1000 px width |
| Body text | 16 px (cards), 13 px (table cells, source) |
| Stat (hero) | 64 px Bree Serif, cobalt |
| Stat (tile) | 40–48 px Bree Serif, cobalt |
| Card title | 22 px Bree Serif, navy |
| Tile label | 12 px mono caps, tracking 0.14em, Wonderful blue |
| Source line | 12 px mono italic, faint, bottom-pinned |

Never go below 12 px on the deck.

### Color palette (deck)

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0a1f3d` | titles, body on light, dark fill |
| `--ink-body` | `#2a3550` | body text default |
| `--ink-soft` | `#5d6677` | secondary labels |
| `--paper` | `#fbf9f2` | default slide bg (warm cream) |
| `--paper-soft` | `#efe9d8` | envelope tone for alternation |
| `--paper-warm` | `#e8dec3` | manila tone for alternation |
| `--paper-mist` | `#e1e8f5` | cool mist tone for alternation |
| `--accent` | `#2851ff` | Wonderful blue — eyebrows, links, table headers |
| `--highlight` | `#0ba5ff` | cobalt — STATS ONLY + load-bearing lede word |
| `--plum` | `#7a5cff` | track #2 (Talent), industry segment |
| `--emerald` | `#0b8f6b` | track #3 (Pipeline), industry segment |
| `--coral` | `#d9594c` | warning, risk row accent |
| `--amber` | `#d99c2e` | "watch" indicators |

**Rules**
- Champagne / yellow ink is forbidden (decided against earlier).
- Cobalt only on stats and one load-bearing word per slide.
- Wonderful blue carries everything else (eyebrows, links, table headers, accent strips).
- Plum / emerald / coral / amber are *track colors* — used only when a slide names tracks explicitly (sprint, industry mix, risks).

### Slide tone alternation

Anti-monotony pattern. Walk the deck and alternate cleanly:

| # | Slide | Tone |
|---|---|---|
| 1 | Title | ink (dark) |
| 2 | §01 Exec Summary | paper |
| 3 | §02 Global Momentum | soft |
| 4 | §03 Demographic | paper |
| 5 | §04 Macro Catalyst | warm |
| 6 | §05 Why Japan | paper |
| 7 | §06 Competitive | soft |
| 8 | §07 Pillars | warm |
| 9 | §08 Time to revenue | paper |
| 10 | §09 Architecture | mist |
| 11 | §10 Pipeline funnel | soft |
| 12 | §11 PoC tracks | paper |
| 13 | §12 90-day sprint | mist |
| 14 | §13 Launch team | paper |
| 15 | §14 Risks | warm |
| 16 | §15 HQ Asks | ink (dark) |
| 17 | Closing | ink (dark) |
| 18 | Sync notice | soft |

No three same-tone slides in a row.

### Charts and visuals must dominate

- Hero visual (chart, SVG, table) takes ≥60% of the slide vertical when present
- Inline SVGs only (Chrome `--print-to-pdf` silently drops url() images in @page CSS)
- Pyramid + donut: viewBox 600×380 minimum, stretched to fill column
- Gantt: 12 columns ruler, two stacked panels, full row width
- Demographic bars: height ≥220 px, three side-by-side columns
- Funnel: ≥4 rows, widths 100%/62%/32%/12%, hi-contrast colors per row

### Card density rules

- 3-card slide: min-height 380 px per card so it reads as substantial
- 2-card slide: min-height 440 px per card
- 6-tile slide (§02 momentum): min-height 200 px per tile
- All cards: `display: flex; flex-direction: column; height: 100%`
- All grids: `grid-auto-rows: minmax(0, 1fr); flex: 1 1 0; min-height: 0`

These rules together force the content to expand vertically. Empty space below cards is a CSS bug, not a content gap.

### Minimum font sizes (hard floor — every element must pass)

Projector distance + room size + Hosoi reading off the screen → these are the **hard minimums**. Anything below is forbidden. If content doesn't fit at these sizes, cut content, never shrink text.

| Element | Min (deck) | Min (reader) | Notes |
|---|---|---|---|
| H1 (title slide) | 72 px | 56 px | Bree Serif, navy or paper-on-ink |
| H2 (slide title) | 44 px | 36 px | Bree Serif. Never wrap to 3 lines. |
| H3 (card heading) | 20 px | 18 px | Semibold, navy |
| Lede paragraph | 20 px | 18 px | Body font, 1100 px max width |
| Body paragraph | 16 px | 16 px | 1.4 line-height min |
| Card body | 15 px | 16 px | |
| Table cell | 14 px | 14 px | |
| Tile / eyebrow label (mono caps) | 13 px | 12 px | tracking 0.14em min |
| Bar-chart annotation | 15 px | 14 px | Year labels, value labels |
| Gantt task label | 13 px | 13 px | Mono, 700 weight |
| Donut legend | 15 px | 14 px | Company-name sublabel may be 13 px |
| SVG annotation (in-chart text) | 13 px | 13 px | `font-size="13"` in SVG units when viewBox is roughly the rendered size |
| SVG hero number (in-chart) | 28 px | 24 px | Pyramid tiers, hero callouts inside SVG |
| Stat hero (above the fold) | 64 px | 56 px | Bree Serif, cobalt |
| Stat tile (inline grid) | 40 px | 36 px | Bree Serif, cobalt |
| Source line | 13 px | 12 px | Mono italic |

**ABSOLUTE FLOOR: 14 px on the deck. 13 px on the reader.** Nothing below. Includes SVG `font-size` attributes — when in doubt, bump up.

**Enforcement (CI gate)**: a search for `text-\[1[012]px\]` or `font-size="[1-9]"` in any rendered page source must return zero. If it finds matches, the build fails the recipe review.

**SVG sizing rule**: in-SVG `font-size` values are in viewBox units. If the SVG viewBox is roughly the same as its rendered size (e.g. 600×400 viewBox rendered at ~600 px wide), `font-size="13"` = 13 px on screen. If the viewBox is smaller (e.g. 100×100 donut), scale up: `font-size="11"` reads as ~22 px when rendered at 200 px wide. Always test the rendered size — never trust the SVG number alone.

**Test recipe** (after any font change):
1. Render at 1280×720 (deck) / desktop width (reader).
2. View at 100% zoom in your browser.
3. Stand 2 meters back. If you can't read the smallest text, it's too small.
4. Re-render after fix. Repeat.

### Slide layout gates (hard rules — every slide must pass)

These are **gates**, not suggestions. If a slide fails any of these, it's wrong-recipe.

**Gate 1 · The whole slide must be used.**
- No card may have ≥80 px of empty interior at the bottom.
- No slide may have ≥80 px of empty paper between the last content row and the bottom safe edge.
- Cards must use `justify-content: space-between` so content distributes top-to-bottom.
- Every card carries a bottom accent ribbon (`::after`) for visual closure — empty paper at the foot of a card is forbidden.

**Gate 2 · Hero numbers go in a row at the top, supporting content goes below.**
- For any slide whose claim rests on N numbers, render the numbers as a single row of N tiles at the top (24–40% slide height).
- Render the supporting reasoning below as a 2-column grid spanning the full width (the remaining 60–76%).
- Do NOT mash a single number + its essay into a tall card. Stat + label go in the hero row; bullets / evidence go in the evidence row.

**Gate 3 · Two zones per slide.**
- Zone A (top, after eyebrow + h2 + lede): hero strip (numbers, gantt ruler, pyramid, donut, or chart canvas).
- Zone B (bottom): 2-column or 3-column evidence grid, full width.
- A slide may NOT have three or more content zones (eyebrow + title + lede counts as one zone).

**Gate 4 · Every card has a bottom anchor.**
- Either a `card-foot` element pinned via `margin-top: auto` (a detail line, a source link, a CTA).
- Or the 3 px gradient ribbon (`::after`).
- Or both. Never neither.

**Gate 5 · Density floor.**
- Cards: min-height 380 px (3-card layout) / 440 px (2-card layout).
- Tiles in a 3×2 grid: min-height 200 px.
- Hero tiles: min-height 140 px.

**Gate 6 · No three same-tone slides in a row.** Walk the deck and enforce alternation.

**Gate 7 · One headline per slide. Speaker notes mandatory.**

**Gate 8 · Pixel-perfect rendering.** Every slide must screenshot clean at 1280×720 (deck) and at the reader's natural viewport. Disqualifying defects:
- Text overlapping other text or shape edges
- SVG labels colliding with their parent shape (e.g. legend bleeding into pyramid tier)
- Cut-off content at any edge of the safe area
- Chart segments missing or partially drawn (e.g. donut with gaps where math doesn't match radius)
- Misaligned rows / columns (cells with mismatched grid-template-columns)
- White card on white-ish tinted bg with no visible boundary
- Stat numbers under the rendered eyebrow strip
- Bottom accent ribbon obscuring final line of content

**Gate 9 · SVG math must match.** When changing an SVG `r=` value on a circle used with `stroke-dasharray`, recompute the circumference constant. `DONUT_C = 2 * π * r`. If r changes from 30 → 32, `DONUT_C` becomes 201 (not 188). Otherwise segments under-fill the circle by ~6% and a gap appears.

**Gate 11 · Shared SVG data must resolve CSS variables in both contexts.**

If `src/data/<page>.ts` carries inline color strings like `var(--color-accent)` (mini-site naming), the deck route MUST define the same `--color-*` variables in its inline `<style>` block. Otherwise undefined variables fall back to `currentColor` (usually black) or transparent, and SVG segments render as the wrong color or disappear entirely — without throwing an error.

**Pattern**: in `present.astro`, declare the mini-site aliases AND the deck-native names side by side:
```css
:root {
  --color-accent: #2851ff;       /* mini-site name, used by shared data */
  --color-accent-ink: #0a2bbf;
  --color-ink-soft: #5d6677;
  /* ... */
  --accent: #2851ff;             /* deck-native name, used by deck CSS */
  --accent-ink: #0a2bbf;
  /* ... */
}
```

**Verification**: dump the rendered SVG via headless Chrome and search for `var(--color-accent)`. If it appears in a `stroke=` or `fill=` and the slide shows the affected shape missing or off-color, the variable isn't defined in the deck context. Add the alias.

## Text contrast minimums (canonical — added 2026-06-03)

Every text element must clear these contrast thresholds against its background. Below them, the text reads as decoration, not information.

### WCAG-aligned floors (deck + reader)

| Text size | Min contrast ratio | Fail-safe rule |
|---|---|---|
| ≥18 px regular / ≥14 px bold | 4.5 : 1 | If text is body-weight on a tinted bg, use `--ink` (#0a1f3d). Never `--ink-soft` or lighter for required info. |
| ≥24 px regular / ≥18 px bold | 3.0 : 1 | Display headlines can use `--ink-soft` on paper-bg ONLY when next to higher-emphasis context. |

### Deck visuals MUST match the mini-site narrative (data fidelity)

If a chart appears on both `/page` (reader) and `/page/present` (deck), the **time periods, bar lengths, track positioning, and labels** must match. Different framings of the same data are not "polish variations" — they tell different stories and undermine trust.

**Slide 9 (Time to Revenue) bug, 2026-06-03**:
- Mini-site §08 Gantt: Wonderful tracks ran M1-M6 (Legal & Entity), M1-M7 (Talent), M1-M7 (Pipeline), Revenue M6-M8.
- Deck slide 9 Gantt (before fix): Wonderful tracks all ended at M3, Revenue at M5-M8.
- The deck claimed the entire Wonderful plan completed in 3 months, contradicting the reader version and the actual plan.

**Rule**: when copying a chart from reader to deck, transcribe the underlying data values (start, end, label) verbatim. The chart's *visual style* may differ (Gantt grid columns vs flex bars with percentages), but the *story it tells* must be identical. If you find yourself writing "M1-M3" in the deck while the mini-site says "M1-M6", stop — you're changing the strategy in passing.

**Verification**: render the mini-site section and the deck slide side by side. For each tier/bar:
1. Compare start period → must match.
2. Compare end period → must match.
3. Compare label text intent → must match (abbreviations OK).
4. Compare parallel vs sequential layout → must match.

### Grid containers: flex: 1 only when slide content depends on filling

Two patterns for card grids in a slide:

1. **`flex: 1` (grow to fill)** — use when the cards' content is dense and you NEED the cards to expand vertically to give the content breathing room. Risk: sparse cards over-expand and look hollow.
2. **`flex: 0 0 auto` (size to content)** — use when cards have sparse content. The grid takes natural height; empty space sits BELOW the grid (above the source line). Cards stay compact and read as intentional.

**Default**: `flex: 0 0 auto`. Only switch to `flex: 1` when a specific card needs growing, and pair with anchor content (icon, big stat number) to prevent floating.

**Slide 8 (Pillars) bug, 2026-06-03**: cards-3 was `flex: 1`, making each pillar card ~440 px tall on a 720 px slide. With 3 bullets per card (~120 px content), each card had ~280 px empty inside. Even after centering content, the cards looked oversized. Fix: `flex: 0 0 auto`, cards take natural height, ~180 px breathing room sits BELOW the grid as intentional slide-level padding.

### Source citation positioning: natural flex flow, never absolute

**Rule**: `p.source` is a **flex item** of the slide section, with `flex: 0 0 auto; margin-top: 12px; border-top: 1px solid var(--line); padding-top: 6px;`. The card grid above (`cards-3`, `japan-grid`, `evidence-grid`, comparison table) is `flex: 1 1 0` and auto-shrinks to leave space for the source row.

**Forbidden**: `p.source { position: absolute; bottom: 16px; right: 24px; }`. This was tried — every slide with a card extending toward the bottom-right ended up with the source pill overlapping the card's corner. The absolute pill has no awareness of the cards' actual rendered height, so as soon as a card's bottom extends past the reserved padding zone, the pill overlays it. Cards in `flex: 1` containers always extend to fill — so this positioning is structurally guaranteed to collide eventually.

**The natural-flow pattern (current canonical)**:
```css
.reveal p.source {
  flex: 0 0 auto;            /* size to content, do not grow */
  margin-top: 12px;
  padding-top: 6px;
  border-top: 1px solid var(--line);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  font-style: italic;
  color: var(--ink-faint);
  text-align: right;
  opacity: 0.6;
}
```

Pair with `.reveal .slides section { padding-bottom: 40px; }` (no need for the 64-px overlap buffer — cards no longer extend into the source zone).

**Verification**: render each slide that has a `p.source`. The source must read as a separate row BELOW the cards, with a clear top-border separator. If it overlays card content, the cards-above container is missing `flex: 1 1 0` or has `position: absolute`, or the source has `position: absolute` (forbidden).

### Source citation text budget (≤ 160 chars)

The source pill is `position: absolute; bottom: 16px; right: 24px; max-width: 44%; font-size: 10px italic mono`. At those dimensions, **160 characters fit on one line**. Beyond that, the text wraps to a second line and collides with whatever card sits in the bottom-right of the slide.

**Rule**: every `p.source` body MUST be ≤ 160 characters. Use abbreviations:
- "Source:" prefix → drop it. The italic mono styling marks it as a citation.
- "industry analyst consensus" → "analyst consensus"
- "IDC Japan, Gartner JP" → "IDC + Gartner JP"
- "ACV peer benchmark via SaaSOptics & SaaStr APAC regional reports" → "ACV via SaaSOptics, SaaStr APAC"
- Multiple sources → join with " · " bullets, not "and" / "&" / commas.

**Verification**: `awk '/class="source"/,/<\/p>/' presentN.astro | tr -d '\n' | awk '{print length($0)}'` — any value > 160 must be trimmed.

### One source citation per slide (consolidate)

Each slide gets **exactly one** `p.source` line — pinned absolute bottom-right of the section. Nested sources inside cards/charts are FORBIDDEN. They double-print citations, push card content up, and confuse the eye.

**Rule**: if a chart card needs a source, lift the citation OUT of the card to the section-level `p.source`. Never both.

**Verification**: `grep -c "class=\"source\"" presentN.astro` per slide must be 0 or 1. If 2+, consolidate.

### Sparse content needs a visual anchor, not centered floating

When a card's content runs short and its `min-height` leaves breathing room, two options:

1. **Add a numeric or icon anchor at the top of the card** (preferred). The anchor — 56 px Bree Serif number in cobalt highlight, like "01 / 02 / 03" on HQ Asks and Pillars — gives the card a visual weight that holds the eye. Content stays `justify-content: flex-start` so it reads top → bottom naturally.
2. **Center content vertically** (fallback). Only when no logical anchor exists. Looks ok for 2-3-bullet cards but reads as "floating" for anything richer.

**Forbidden**: short content (3 bullets, ≤80 words) at the **top** of a tall card with empty space at the bottom. Either anchor with a number/icon, or center.

**Pattern (used on §07 Strategic Pillars and §15 HQ Asks)**:
```html
<div class="card">
  <div class="head-row">
    <div class="num hl">01</div>
    <div class="titles">
      <div class="tile-label">Pillar</div>
      <h3>Credibility</h3>
    </div>
  </div>
  <ul>...</ul>
</div>
```

The big `01` in cobalt anchors the card. Without it, the same content would float in the middle and look weak.

### Card content vertical centering (sparse content rule)

When a card's content is shorter than the card's min-height, breathing room must distribute **top + bottom equally**, not pool at the bottom. Bottom-only empty space reads as "content got truncated" or "this card is broken."

**Rule**: cards in 3-card / 2-card grids use `justify-content: center` so content sits vertically centered. The bottom accent ribbon stays pinned at the slide bottom edge via `::after { position: absolute; bottom: 0 }`.

**Exception**: cards whose first child is a giant stat number (`.num:first-child`) stay `justify-content: flex-start`. The stat anchors the card visually; centering it floats the number in space and looks weak.

```css
.reveal .card { justify-content: center; }
.reveal .card:has(> .num:first-child),
.reveal .card:has(> .poc-head) { justify-content: flex-start; }
```

**Verification**: render the slide. If the content sits at the top of the cards with empty space at the bottom, the card is wrong-recipe. Bottom-only empty space = forbidden.

### Visual element fills must contrast with slide tone

A shape (pyramid tier, card body, donut center, callout box) must use a **different fill** than the slide's `data-state` tone. Otherwise the shape's outline reads as a stray line and the shape itself disappears.

**Rule of thumb**: if `data-state="soft"`, use `--paper` (cream) as the shape fill. If `data-state="paper"`, use `--paper-soft` (envelope) for shape fills. Always one step away from the tone.

**Examples**:
- Pyramid `LOW` tier on a `soft` slide → fill `var(--paper)` with `var(--ink-soft)` stroke 2px. ✓
- Card on a `soft` slide → fill `var(--paper)` with 2px border. ✓
- Donut center hole on any slide → fill `var(--paper)` regardless of tone (creates the "hole" effect). ✓
- ❌ Pyramid base on a `soft` slide with fill `var(--paper-soft)` — same as slide bg, shape vanishes.
- ❌ Card on a `paper` slide with fill `var(--paper)` — same as slide bg, shape vanishes.

### Multi-visual alignment in a 2-col layout

When two visuals share a slide (pyramid + donut, chart + side stats, table + callouts), they MUST align eye-to-eye. The parent grid container uses `align-items: center` so both visuals sit at the same vertical line.

**Forbidden**: pyramid top-aligned with donut center-aligned. The eye darts between them looking for the matching anchor.

**Rule**:
- `.two-col`, `.evidence-grid`, `.japan-grid`, any `display: grid; grid-template-columns: Xfr Yfr` container that holds two visuals → `align-items: center` on the container.
- Each child column with an SVG should also have `display: flex; justify-content: center; align-items: center;` so the SVG centers within its column.

### Forbidden text/bg combinations (these fail at projector distance)

- ❌ `--ink-soft` (#5d6677) text on `--paper-soft` (#efe9d8) bg — reads as ghosting
- ❌ `--ink-faint` (#98a0ad) on any tinted bg — invisible from 2 m
- ❌ `--ink-faint` for required info anywhere. Reserve for "Non-target / context only / footnote" italic labels where the meaning is "you can ignore this"
- ❌ Source citations brighter than `--ink-soft` italic — they upstage the slide content
- ❌ White text on `--accent-soft` (light blue) fill — readable but low contrast; use `--ink` instead

### Hierarchy-by-contrast rule

Within a single tier of a multi-tier visual, text emphasis must match the tier's emphasis:

- **HIGH tier**: white or `--paper` text on accent fill (max contrast)
- **MID tier**: `--ink` text on accent-soft fill (high contrast)
- **LOW tier**: `--ink` text on paper-soft fill (high contrast for the label itself, even though the tier is de-emphasized). De-emphasize the LOW tier via fill saturation, not by faded text. Faded text = unreadable; faded fill = visible but quieter.

**Pyramid example (slide 10 §09 Architecture)**:
- Top tier "~500" — white on Wonderful blue. ✓
- Mid tier "~11,000" — `--ink` (navy) on `--accent-soft` (light blue). ✓
- Bottom tier "~3.66M" — `--ink` (navy) on `--paper-soft` (cream). ✓ — was `--ink-soft` (grey) before, failed contrast
- Bottom tier italic "Non-target · context only" — `--ink-soft` (grey) IS allowed here, because the *meaning* of this label IS "context only"
- Right-side percentages — `--ink-soft` IS allowed at 18+ px because they're paired metadata, not the headline

### Verification

After any color edit on a multi-tier visual:
1. Render to PNG at 1280×720.
2. Read every label aloud at 50% zoom (simulates 2 m projector distance).
3. If you have to lean in to read a label, it fails. Bump fill or text to higher contrast.

## Color hierarchy rules (canonical — added 2026-06-03)

Apply to every multi-tier visual (pyramid, funnel, gantt, stacked bar, donut, table, card grid). These are **gates**, not suggestions. Same rules apply to every `*.anysigma.com` mini-site.

### The three-emphasis ladder

Every visual element belongs to exactly one rung:

| Rung | Visual role | Color token | Used for |
|---|---|---|---|
| **HIGH** | "Look at me. This is the wins / the headline / the target." | `--accent` (Wonderful blue) **or** `--highlight` (cobalt) when stat number | Pyramid top, funnel bottom (final win), gantt highlight panel, table header row, hero stat number, load-bearing keyword in lede |
| **MID** | "Supporting evidence. This matters but isn't the wins." | `--accent-soft` (tinted), or named track colors (`--plum` / `--emerald` / `--coral` / `--amber`) | Middle pyramid tier, middle funnel tiers, gantt secondary bars, body cards, table cells |
| **LOW** | "Context. This is the universe / background." | `--paper-soft` / `--paper-warm`, `--ink-soft` border, `--ink-faint` text | Bottom pyramid tier (the 99.7% noise), funnel top tier (the universe), faded gantt rows, source citations |

### Visual gravity rules

1. **The HIGH rung always sits where the eye lands first.** In a pyramid that's the top tier. In a funnel that's the destination row (`5 paid wins`). In a stacked bar that's the highlighted segment.
2. **Never give two rungs the same emphasis.** If both top and middle tier use a vivid color, the brain reads them as parallel, not hierarchical.
3. **Direction of emphasis is consistent within a single visual.** Pyramids: vivid top, fading down. Funnels: faded top, vivid bottom (where the wins live).
4. **The HIGH rung must contrast strongly with the slide background.** On `paper` or `soft` slide tones, Wonderful blue (`#2851ff`) works. On `ink` slide tone, the cobalt highlight works. On `mist` slide tone, blue accents are FORBIDDEN (Gate 10).

### Forbidden patterns

- ❌ Vivid accent in middle tier while top tier is dark/neutral. Inverts the hierarchy.
- ❌ Three or more rungs in the same hue family. The brain reads them as one shape.
- ❌ Using `--accent-ink` (deepest blue) as a fill on a tier — it reads as ink, not as accent. Reserve for hover states and depth shadows.
- ❌ Mixing `--accent` and `--highlight` in adjacent positions in the SAME visual — both are blue family, they will read as one segment.
- ❌ Using a track color (plum/emerald/coral/amber) on a non-tracked element. Track colors are reserved for explicit named tracks (sprint timeline, industry segments, risk rows).

### Verification recipe (every multi-tier visual)

1. Squint at the rendered slide at 1280×720 from 2 m back.
2. Name aloud: which element is HIGH, which is MID, which is LOW?
3. If your eye lands on the wrong element, or you can't tell the rungs apart, the colors are wrong.
4. Fix and re-shoot. Don't ship a hierarchy that the audience has to read twice.

### Applies to mini-sites too

The same rules govern `<Section>` content in any `*.anysigma.com` mini-site (`/Users/mavila/github/personal/anysigma.com/subdomains/<slug>/`). When porting a visual from reader to deck (or vice versa), the rung assignments must stay identical. If the mini-site SVG uses `var(--color-accent)` on the top tier, the deck SVG does too.

## Gates (continued)

**Gate 10 · No same-hue clash between slide tone and accent.** The Boardroom palette has Wonderful blue (`--accent`) and cobalt highlight (`--highlight`) — both in the blue family. The slide tones include `mist` (#e1e8f5, light cool blue). Putting blue accent shapes (pyramid fills, donut segments, gantt bars, table headers, ribbons) on a `mist` slide makes the accent blend into the background.

**Rule**: a slide with a blue-family accent in its visual must NOT use `data-state="mist"`. Use `soft` (envelope #efe9d8), `warm` (manila #e8dec3), or default `paper` (#fbf9f2) instead.

**Mist tone is reserved for slides whose dominant visual is non-blue** — purple/plum (sprint timeline track-2), emerald (sprint timeline track-3), ink-charcoal (table rows), or photographic. In practice that's a narrow window; default to `soft` when in doubt.

Verification recipe for tone choice:
1. Render the slide at 1280×720.
2. Squint at the screen from 2 m back.
3. If a load-bearing shape "disappears" into the slide background at distance, the tone is wrong.
4. Try the next adjacent tone (mist → soft → warm) and re-render.

### Reader vs Deck — separate scaling rules

| Aspect | Reader (mini-site) | Deck (Reveal) |
|---|---|---|
| Layout | Flowing, scrolling | Fixed 1280×720 16:9 |
| Title (h2) | 40–56 px | 52 px |
| Body | 16 px / 1.55 | 17 px / 1.4 |
| Stat hero | 64–80 px | 64 px (hero tile) / 48 px (tile) |
| Lede width | max-w-4xl (~900 px) | max 1100 px |
| Whitespace below content | Allowed (reader controls pace) | Forbidden (Gate 1) |
| Source URLs visible | Yes (hyperlinks live) | No (pinned footer, no `(https://…)` expansion) |
| Page chrome (header/nav) | Visible | Hidden in deck |

### Forbidden patterns

- ❌ White-on-white floating cards (always pair with border + soft fill)
- ❌ Lede + title on slide N, content on slide N+1 (orphan title slide)
- ❌ More than one accent color per slide (cobalt for stats OR plum for tracks, not both)
- ❌ Em-dashes anywhere
- ❌ Source citations in the body — always footer-pinned
- ❌ Speaker notes empty
- ❌ Three same-tone slides in a row
- ❌ Card content shorter than the card's min-height (looks floaty)

### Verification recipe

After any change to `present.astro` or `launch-plan.ts`, run:

```bash
pnpm build
pnpm wrangler  # or pnpm preview, ensure 4326 is up
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18; do
  "$CHROME" --headless=new --disable-gpu --no-sandbox \
    --window-size=1280,720 --virtual-time-budget=4000 \
    --screenshot=/tmp/deck-$(printf "%02d" $i).png \
    "http://localhost:4326/launch-plan/present#/$((i-1))" 2>/dev/null
done
```

Then visually inspect every slide. Look for:
1. Empty band ≥80 px at the bottom (whitespace bug)
2. Content cut off at the right or bottom (overflow bug)
3. Tone clash with neighbors (>2 same in a row)
4. Stat number not in cobalt (palette violation)
5. Eyebrow color not Wonderful blue (palette violation)

If any of those fail, the slide is wrong-recipe. Fix and re-shot.

## Sync model

| Edit | Where | Effect |
|---|---|---|
| Number changed | `src/data/launch-plan.ts` | Both modes update on next build |
| Slide added | `src/pages/launch-plan/present.astro` | Deck only; add same content as a `<Section>` in `launch-plan.astro` for the reader |
| Tone change | `data-state="…"` attr on the `<section>` | Deck only |
| Palette change | `src/styles/palettes/boardroom-navy.css` + CSS vars in `present.astro` | Both modes (manual mirror) |

Mini-site footer carries `Last synced: YYYY-MM-DD`. Bump when content changes.
