# Design system

Why the choices on this page are the way they are. Future-you, don't re-litigate these without a strong reason.

---

## Typography

**Display: Instrument Serif.** It reads as editorial rather than AI-startup-generic. Most early-stage SaaS lands on Inter-everything or Söhne-everything, which is fine — and forgettable. A serif display signals "we wrote this carefully" before the reader has parsed a word. We use it large (text-5xl → text-8xl in heroes), light weight (400), and tight letter-spacing (`-0.015em`) to keep it crisp.

**Body: Inter.** Variable, neutral, extremely well-paired with a literary serif. Inter is intentionally boring so the serif headline can do the heavy lifting.

**Mono: JetBrains Mono.** For labels, captions, dates, decision numbers. It signals "engineered" without shouting.

**Japanese fallbacks built in.** `Hiragino Mincho ProN` and `Noto Serif JP` for display; `Hiragino Kaku Gothic ProN` and `Noto Sans JP` for body. JP content renders correctly on macOS without a font swap, and the Google Fonts `link` preconnect covers everything else.

Sources: [Tailwind v4 theme docs](https://tailwindcss.com/docs/theme), [Google Fonts — Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif).

---

## Color: OKLCH

OKLCH is perceptually uniform — change one hue value (the third coordinate) and the perceived lightness stays constant. That's why our five palette presets (`warm-orange`, `cool-blue`, `forest-green`, `slate`, `plum`) feel coherent: the lightness/chroma coordinates are essentially the same, only the hue shifts.

**The pattern:** every site keeps the same neutral ink/paper/line tokens and the same semantic success/warning/danger tokens. Only the three accent tokens (`--palette-accent`, `--palette-accent-soft`, `--palette-accent-ink`) swap per project. One `@import` line in `src/styles/tailwind.css` chooses the palette.

Sources: [Tailwind v4 colors](https://tailwindcss.com/docs/colors), [oklch.com](https://oklch.com/) (perceptual color picker).

---

## No dark mode (by default)

These pages are read by execs in daylight, on a laptop, often via screenshot in a thread. Building dark mode correctly doubles the surface area of every contrast check and animation calibration. Skip it until a specific reader asks for it.

---

## Background: subtle grain, not gradients

Hero gradient backgrounds — purple-to-pink, mesh blurs, animated SVGs — have become a visual cliché for AI/SaaS. They also wash out body copy and fight the eye.

Instead: a fixed radial-dot grain at 2.5% opacity on a 28px grid (`.bg-grain` in `tailwind.css`). Adds tactile depth without competing with the content.

Do not reintroduce hero gradients without explicit user permission. This is a design invariant.

---

## Animation philosophy

Three principles:

1. **Reveal-on-scroll for content** — `data-reveal="fade-up"` with optional `data-reveal-delay={n}` × 80ms stagger. Implemented as a 20-line IntersectionObserver in `Layout.astro`, no library. Variants: `fade-up` (default), `scale`, `left`.
2. **Micro-interactions on hover** — `.tile` lifts 2px with a soft shadow on hover; `.arrow-pop` translates 2px diagonally on group hover. Hint, don't dance.
3. **`prefers-reduced-motion` always wins** — the media query in `tailwind.css` zeroes out every transition and reveals all `data-reveal` elements immediately. Don't add animation that doesn't honor this.

The easing function is `cubic-bezier(0.16, 1, 0.3, 1)` throughout — a snappy "ease-out-expo" that feels responsive without being twitchy.

Source: [Astro docs on view transitions and IntersectionObserver patterns](https://docs.astro.build/en/guides/view-transitions/).

---

## The story-arc pattern

The single biggest reason these mini-sites work for stakeholder pitches: they're structured as a narrative, not a brochure. The recommended arc (with section IDs):

1. **Hero** — one big claim + 3 anchoring stats
2. **Posture** — "what this is / isn't" reframe (preempts misreading)
3. **Trends / context** — the trigger (what changed in the world)
4. **The insight / mechanic** — the unique idea
5. **Plan** — phases, timeline, concrete commitments
6. **Prior art / case studies** — pattern-match to known successes
7. **What we're committing** — be honest: 1 commitment + 2 hypotheses
8. **Tension beat** — the dark section, one dramatized statistic
9. **Resolution / stage-gate** — the pre-committed decision rule
10. **The ask** — numbered decisions with ratification chips
11. **How to engage** — three response channels
12. **Honest gap list** — what's still missing (builds trust)

Not every site needs all twelve. Most use 8–10.

This pattern is documented in detail in [`product.md`](./product.md).

---

## Cloudflare Pages constraints we design around

- **Pages output is static** — no SSR runtime in our setup. Every page is prerendered HTML.
- **Pages serves `dist/`** — `pages_build_output_dir = "dist"` in `wrangler.toml` matches Astro's default `build.dir`.
- **Pages + Access supports 14-day rolling sessions** — `DEPLOY.md` matches this. Don't ship anything that would break inside the Access wall.

Source: [Cloudflare Pages docs](https://developers.cloudflare.com/pages/), [Cloudflare Access docs](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/).
