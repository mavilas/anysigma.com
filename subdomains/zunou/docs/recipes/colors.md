# Zunou · Colors (site-specific notes)

The discipline lives at the apex repo: **[`/docs/recipes/visual-discipline.md`](../../../../docs/recipes/visual-discipline.md)**. Read that first.

This file holds **Zunou-only** notes — the brand palette and the per-site exceptions, nothing else.

## Brand accent

Zunou's single accent is **purple `#4a00e0`** (Bree Serif + Bricolage Grotesque are the type story). Tokens live in `src/styles/tailwind.css` under `@theme`:

| Token | Hex | Use |
|---|---|---|
| `--color-accent` | `#4a00e0` | Brand purple. Eyebrows, key headings, primary CTA bg, accent-bordered callouts |
| `--color-accent-soft` | `#ece5fb` | Pill backgrounds, soft accent surfaces, top-banner tint |
| `--color-accent-ink` | `#3700a8` | Accent text on `accent-soft`, link hover, pill text |

## Per-site exceptions

None. Zunou follows the apex visual-discipline recipe in full.

## See also

- Apex: `/docs/recipes/visual-discipline.md` — the universal rules
- `src/styles/tailwind.css` — token definitions
- `AGENTS.md` § Visual system — short-form rules with link back here
