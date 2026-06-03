# Recipe · Visual discipline (reader-side addendum)

**This is an addendum.** The canonical brief lives at:

📘 **`../../AGENTS.md`** at the apex of this repo (universal rules across all subdomains)
📘 **`../deck-recipes.md`** (sibling) — 11+ hard gates for decks + readers: typography, color hierarchy, slide layout, SVG math, headless verification

Read those first. This addendum covers only the **reader-page-specific patterns** that the canonical brief doesn't go into — the things that apply when you're building a scrolling Astro mini-site (not a Reveal deck).

---

## 1 · Hero pattern (title + subtitle + lede — DO NOT NEST)

Three discrete elements with a clear size step at each rung. **Never nest the subtitle inside the H1** as a `<span>`. The span inherits the H1's font-size; italic styling alone can't compensate. The subtitle renders at H1 size and looks visually wrong.

```astro
{/* ✅ Right — three distinct elements */}
<h1 class="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.04] tracking-tight mb-4">
  The page title goes here.
</h1>
<p class="font-display italic text-xl sm:text-2xl text-[var(--color-ink-soft)] leading-snug mb-7 max-w-3xl">
  Short poetic subtitle. One sentence. Maybe two.
</p>
<p class="text-lg sm:text-xl text-[var(--color-ink-soft)] leading-relaxed mb-8 max-w-3xl">
  Lede paragraph: the explanatory copy.
</p>

{/* ❌ Wrong — subtitle inherits H1 size */}
<h1 class="font-display text-4xl sm:text-5xl">
  Title.<br />
  <span class="text-ink-soft italic">Subtitle. Renders at H1 size. Wrong.</span>
</h1>
```

| Element | Reader | Notes |
|---|---|---|
| H1 (page title) | 40 → 56 → 64 px (`text-4xl sm:text-5xl lg:text-6xl`) | Two lines max. `leading-[1.04]`. |
| Subtitle | 20 → 24 px display italic (`text-xl sm:text-2xl`) | One sentence, two max. `text-ink-soft`. Separate element. |
| Lede | 18 → 20 px body (`text-lg sm:text-xl`) | 1100 px max width. `text-ink-soft`, `leading-relaxed`. |
| CTA buttons | 14 px (`text-sm`) | Sits below the lede with `gap-3`. |

Stacking order: eyebrow chip (optional) → title → subtitle → lede → CTA row. Always in that order.

---

## 2 · Section header shape (every numbered section, every page)

Three elements, always in this order: numbered badge → display H2 → optional lede.

```astro
<section id="my-section" class="py-16 sm:py-20">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex items-center gap-4 mb-6" data-reveal="fade-up">
      <span class="section-number"><span>03 · The Wedge</span></span>
    </div>
    <h2 class="font-display text-3xl sm:text-4xl mb-6 max-w-3xl leading-tight"
        data-reveal="fade-up" data-reveal-delay="1">
      ...display title...
    </h2>
    <p class="text-base text-[var(--color-ink-soft)] leading-relaxed mb-6 max-w-3xl"
       data-reveal="fade-up" data-reveal-delay="2">
      ...optional lede...
    </p>
    ...content...
  </div>
</section>
```

Drop the lede if there's no lede, but never swap the order.

---

## 3 · Container width (per page)

- **Full pillar page:** `max-w-6xl mx-auto px-6` on every `<section>` wrapper.
- **Scan / condensed / leave-behind page:** `max-w-4xl mx-auto px-6`.
- **Pick one at the top of the page.** Do not mix containers within a single page.
- Inner prose paragraphs may step in to `max-w-3xl` for readable line length, but the *gutter* (the section's container) stays the same.

---

## 4 · Section rhythm

- **Full page:** `py-16 sm:py-20` per `<section>`.
- **Scan page:** `py-10` (or `py-12` for the hero only).
- Alternate background tone using `bg-[var(--color-paper-soft)]` for rhythm. Don't change padding to fake rhythm — change the surface tone.

---

## 5 · Cards, grids, surfaces

### Same grid → same shape
Every card inside one grid container shares:
- **Padding** (`p-4` chip / `p-5` standard / `p-6` important / `p-7` hero — match within the grid)
- **Border weight** (don't mix `border` and `border-2`)
- **Rounding** (`rounded-xl` major, `rounded-lg` sub-card inside a panel, `rounded-md` button, `rounded-full` pill)
- **Background** (don't mix `bg-paper` and `bg-paper-soft` in the same row)

### The emphasized card rule
- A page may have **one** `border-2 border-[var(--color-accent)]` card. The "if you only read one tile, read this" gate.
- Never two `border-2` cards on the same page in different grids.

### Common grid shapes
- 4-card stat row (`.stat-xl`): `grid grid-cols-2 md:grid-cols-4 gap-3`
- 3-card tile row: `grid sm:grid-cols-3 gap-3`
- 2-card tile row: `grid sm:grid-cols-2 gap-3` (or `gap-4` for breathing)
- Vertical list of full-width cards: `space-y-3`

`gap-3` is default. `gap-4` only when cards have significantly more vertical content.

### Panel sections
- `rounded-2xl bg-paper-soft` is reserved for *boxed groupings* of cards that conceptually belong together.
- A panel sits **inside** a normal `<section>` wrapper; it doesn't replace it.
- Don't nest panels inside panels.

---

## 6 · Left-align prose by default

- Body, ledes, list items, card text: **left-aligned.**
- `text-center` is reserved for:
  - The page footer signature line.
  - The hero stat figure inside a `stat-xl` card (built into the class).
  - The single closing line on a dark `bg-ink` outro section.
  - Table cells in comparison matrices.
- **Deck-format pages exception:** customer-facing decks at `/pilots/<partner>/deck` use slide centerpieces and may center title + lede per slide.

---

## 7 · Pre-merge audit (the squint test)

Open the page in dev. Squint at it. Ask:

1. Containers — same `max-w-*` everywhere?
2. Section rhythm — same `py-*` everywhere?
3. Eyebrow tracking — `0.18em`, `0.22em` (dark closing), or `0.12em` (chip)? No other values?
4. Card grids — every card in each grid same padding, border, rounding?
5. At most one `border-2` accent card on the page?
6. `text-center` only in the allowed positions?
7. Section header shape: number badge → display H2 → optional lede, in that order?
8. Hero stack: title → subtitle (separate element) → lede → CTA row?
9. Any text under 13 px (reader floor)? See canonical doc for the full font ladder.

Any "no" answer = fix before merge or open a PR-level discussion.

---

## Where the rest lives

- **Universal subdomain rules**: `../../AGENTS.md` at apex.
- **Deck + reader canonical rules** (typography minimums, color hierarchy, slide gates, SVG math, headless verification): `wonderful-ai/docs/analysis/deck-recipes.md`.
- **Per-subdomain palette tokens**: `subdomains/<slug>/src/styles/tailwind.css` under `@theme`.
- **Per-subdomain notes**: `subdomains/<slug>/AGENTS.md` and `subdomains/<slug>/docs/recipes/`.

When in doubt: **more restraint, not more decoration.**
