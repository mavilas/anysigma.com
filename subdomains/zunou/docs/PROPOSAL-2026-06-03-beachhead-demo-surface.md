# Proposal · Beachhead demo surface + shareable Zunou
**Date:** 2026-06-03 · **Author:** Marco · **Audience:** internal (Malek, Ilya) before today's GTM pitch
**Scope:** GTM mini-site updates only. No `zunou-services` code changes in this proposal.

---

## 1 · Why this proposal exists

Today's pitch needs to do two things in 20–30 minutes:

1. **Show the beachheads** (Indelible → TAI → communities) so the audience sees a credible sequence, not a wish list.
2. **Make people *feel* the product** — not read about it — so the "wow" lands inside the meeting and travels home in their pocket.

Right now `gtm.astro` does (1) very well — 4,956 lines, every wave specified, gates documented. It does (2) weakly: there are SVG dashboard mockups but **nothing the investor can touch.** The audience leaves with a strategy memo, not a product memory.

The leverage is in turning the mini-site into a **demo surface** that doubles as a beachhead launcher — and making sure each beachhead has a 60-second "look at this" moment we can drop into the pitch.

---

## 2 · What we have to work with (audit summary)

### 2.1 zunou-services / nova — what's actually shippable today

| Layer | State | Implication |
|---|---|---|
| Runtime | Expo Router on RN 0.81 + RN-Web 0.21 + NativeWind 4 | **One codebase already targets iOS, Android, and Web/PWA.** Web deploys via `expo export --platform web` → S3 → CloudFront → `nova.zunou.ai`. PWA inject script already exists (`scripts/inject-pwa.mjs`). |
| Routes | 30 screens under `app/(app)/*` | Full surface (chats, pulses, schedule, tasks, notes, insights, contacts, meetings, relays, games hub). Investor doesn't need to see all 30 — pick 3. |
| Component domains | 20 (`agent`, `chats`, `collabs`, `feed`, `hero`, `home`, `insights`, `panels`, `pulse-hub`, `relays`, `schedule`, `tasks`, etc.) | High coupling to domain logic. **Most are not reusable as primitives.** |
| UI primitives (`components/ui`) | 17 files | Mostly sheets/toasts/dialogs. **No design-token export, no `<Button>`, no `<Card>`, no `<Stat>`, no `<EmptyState>`.** Each screen rolls its own. |
| Deeplink share | `/connect/[userId]` exists with QR + sessionStorage handoff for unauth users | **Strong foundation** for share-without-email. |
| Guest mode | `GuestBadge` component exists | Not wired into a full guest flow yet, but the scaffolding is there. |
| Seed / demo data | **None.** No `pnpm seed`, no demo workspace script | Biggest gap for investor demos. |
| Brand consistency | Cross-page color is `--color-ink` / `--color-accent` CSS vars in web, but RN side uses NativeWind classes directly | **Tokens not extracted.** Renaming or theming = touch 200+ files. |

### 2.2 anysigma.com/zunou — the mini-site as it stands

10 pages, 12k lines of Astro. `gtm.astro` carries the whole strategy. `index.astro` is the reader's map. There is **no page** that says "here's the product — touch it." The capability matrix in §06 is text-only.

### 2.3 The single biggest insight

> The platform that ships across iOS / Web / PWA already exists in Nova. The platform that ships **a different edition** (Solo, Community, Demo-seed, Investor-seed) does not — because we have no token layer, no feature-flag layer, and no seed layer.
>
> Three small investments (tokens, flags, seed) turn one app into N editions overnight.

---

## 3 · Recommendation — three workstreams

### W1 · "Touch It" — investor demo seed (this week)

A seeded read-only workspace at **`demo.zunou.ai`** that anyone with the link can walk into. No login, no email, no friction.

**What's in it:**
- 6 fake-but-realistic people (a CEO, a CoS, an investor, a portfolio founder, a designer, an EA) in one Pulse.
- 3 weeks of pre-baked meetings, transcripts, agent debriefs, follow-ups already done.
- One open follow-up the agent surfaces ("Tanaka-san asked about Q3 ARR last Tuesday — you haven't responded") — **this is the 5-minute aha.**
- Morning brief tile, the §10C "daily ritual hook" — already rendered for today's date.
- A "share this view" button on every artifact that copies a public read-only URL.

**Why it matters for the pitch:** the audience opens `demo.zunou.ai` on their own phone during the meeting. The product stops being a deck and becomes muscle memory. Loom-style — the artifact *is* the ad.

**Cost:** 3–5 days. Needs a `pnpm seed:demo` script in `zunou-services` (not in this PR — we'd ask Malek to scope), a `read-only` flag we already shape around guest mode, and a public-share token mechanism that reuses the existing `/connect/[userId]` deeplink machinery.

### W2 · "Share It" — give-without-email loop

Email is blocked by Google's enterprise verification timeline (months). We need a path to invite *one specific person* without sending an email from our domain. Three mechanics, all already half-built:

1. **Personal share-link** (extension of `/connect/[userId]`). User taps "share this brief with Ilya" → app generates `nova.zunou.ai/share/<token>` → user pastes into *their own* Slack / iMessage / LINE / WhatsApp. **The user's channel, not ours.** Zero email infra.
2. **QR handoff at events.** Already scaffolded (QRScannerSheet exists). At TAI / AI Tinkerers events, the speaker's slide has a QR — scan → land in a guest version of Zunou with the speaker's debrief already loaded. **This is the §07.1B "1 conference = 1,000 installs" mechanic, finally instrumented.**
3. **Magic-link via *received* email** — when a user connects their own Gmail (already shipped via `EmailAccountsSection`), we can have **Zunou send from their account on their behalf** for invites. The "from" address is the user's, not ours. Google's strictness doesn't apply.

**Why it matters:** unblocks viral spread for the entire Phase 1 window without waiting on Google.

**Cost:** mechanism #1 is ~2 days (token table + share view). #2 is ~1 day (QR + redirect). #3 is bigger (~1 week) and lower priority for the pitch.

### W3 · "Re-shape It" — editions via tokens + flags

This is the longer play that lets us ship Solo / Community / Investor / Indelible-branded / TAI-branded editions on demand. Two pieces:

**A. Extract tokens.** Today: `colors.accent = #4a00e0` lives in Tailwind config + CSS vars + RN inline styles. Pull all of it into `packages/tokens/` with a single export the website *and* the app read from. Then a theme = a JSON file. A "Solo Mocha" edition = a different JSON. We can give Indelible a co-branded build in an hour.

**B. Layer in `<edition>` feature flags.** A small `useEdition()` hook that returns `{tier: 'solo' | 'community' | 'enterprise', surfaces: [...]}`. Components opt-in: `<PulseHub />` reads `surfaces.includes('pulse-hub')`. Solo edition turns off Spaces / Org switcher / Relays. Demo edition turns off auth.

**Why it matters:** every beachhead wave from §07.1A onward can have *its own* edition. Indelible portfolio gets a CoS-leaning build. TAI gets a community-leaning build. The Solo / Pro / Business tier split in §09 becomes a real product, not a pricing table.

**Cost:** tokens = ~3 days; flags = ~1 week; full migration of the 20 component domains = 3–4 weeks of background work, but **we can ship the demo seed (W1) and share loop (W2) without it**, then absorb W3 over Phase 0.

### Suggested order for today's pitch

Lead with **W1**. Demo seed lands the wow. Then point at **W2** as the share mechanic that turns each demo into a chain. Mention **W3** only if asked about scale-out — that's the "and we can ship a TAI-branded edition in an afternoon" line.

---

## 4 · Mini-site (anysigma) edits for today's deck

Concrete changes to the GTM mini-site so the pitch flows. None are new pages — they're slots inside existing pages.

### 4.1 `index.astro` — add a fourth pillar tile: "Try it"
Two-line tile linking to `demo.zunou.ai` (or a coming-soon stub for today). Pattern matches the three existing pillars. Sets the expectation early.

### 4.2 `gtm.astro` §07 — wave card upgrades
Each of the three beachhead waves gets a **"What the audience sees in 60 seconds"** strip under the existing copy. For Beachhead 0 (Indelible): "Kevin opens the CoS view → his last 3 portfolio standups are already debriefed → tap one → see follow-ups." One line, one screenshot, link to `demo.zunou.ai/edition/indelible`. Same shape for Beachhead 1 (TAI) and Beachhead 2 (communities).

### 4.3 `gtm.astro` §10D — annotate dashboard mockup with "live in demo"
Mark which of the 6 KPI tiles already render in the demo seed vs are mocked. Investor sees what's real today.

### 4.4 New page · `/touch.astro` — single-screen demo launcher
Three buttons: "Open the founder edition", "Open the community edition", "Open the events edition". Each launches `demo.zunou.ai/<edition>` with a pre-seeded persona. Optional: a fourth button that generates a personal share-link the audience can text themselves.

### 4.5 `gtm.astro` §06 — capability matrix gets "demo" column
Currently the matrix shows Zunou vs Microsoft Copilot, Glean, Notion AI. Add a column: **"You can see this in the demo right now."** Forces honesty about what's real vs what's roadmapped. Investors trust this more than a green-light matrix.

---

## 5 · What I'd *not* do

- **Don't** rebuild components into a design system *before* the pitch. The pitch needs the demo seed; the tokens can wait.
- **Don't** spin up a second app codebase for a "Solo edition." The flag-based edition system is the right play — even if it lands later.
- **Don't** ship investor email-invites this month. Google's verification timeline is the bottleneck; W2 mechanisms #1 and #2 route around it entirely.
- **Don't** front-load Phase 0 with a docs sprint. The honest gap is *seed data and share rails*, not specification.

---

## 6 · Open questions for Malek (before we move on W1)

- Does the read-only / guest mode in Nova already support a "full workspace, no auth" mode, or just per-resource guest?
- Where would `seed:demo` live — a `zunou-services/scripts/seed-demo.ts` that hits the API as a privileged service account, or a fixture file in `services/api`?
- Public-share-token table — can we reuse the `/connect` intent table, or do we need a separate `shares` resource?
- Token extraction (W3·A) — Malek's read on whether the RN ⇄ Web token bridge belongs in `packages/tokens` or inline in `nova/src/config`?

---

## 7 · 24-hour next step

If this proposal lands: I draft **§07 wave-card upgrades** and the **`/touch.astro` launcher** today (anysigma only), and we hold W1 / W2 / W3 implementation in `zunou-services` for a follow-up with Malek.

If the pitch is in <4 hours: I skip the `/touch.astro` build, prepare a single slide showing the proposed `demo.zunou.ai` flow as a mockup (Figma-style PNG in `/public`), and walk the audience through it verbally — making the *commitment* in the room that the seeded demo ships within Phase 0.
