# Content patterns

Patterns for *what goes on the page*. Use these as a starting structure; cut sections that don't earn their place.

---

## The single-page narrative

Every mini-site is a single scrollable page, ~10–13 sections, ~6–10 minutes to read. Mobile-friendly but designed for desktop reading. No subpages. The header nav anchors to section IDs.

Why one page: stakeholders read it in one sitting, on a phone in a Slack DM, on a laptop in a meeting. Multi-page navigation kills that flow.

---

## Section-by-section playbook

### 1. Hero

The reader decides in 5 seconds whether to keep going. Give them:

- One **big idea** as the headline (Instrument Serif, two-line max). The second line should complicate or invert the first — that's what makes the reader curious.
- One paragraph of context (~3 sentences) with the load-bearing claim in `<strong>`.
- Two CTA buttons: primary = jump to the ask, secondary = read the story.
- Three `Stat` tiles below the fold with the most important numbers.

Avoid: vague missions ("we believe..."), feature lists, gradient backgrounds.

### 2. Posture — "what this is / isn't"

Preempts the most likely misreading. Two columns: "is" with green checks, "isn't" with grey alerts. Three bullets each. Sets expectations explicitly.

This section saves you from every "but I thought you meant..." follow-up.

### 3. Trends / what just changed

The trigger that motivates the rest of the page. Three `Stat` tiles is a clean format. Each stat is a data point + source + one-line caveat.

Pattern: "the window is open right now, it won't be in 12 months" — show the data that proves it.

### 4. The insight / mechanic

The unique claim you're making about *how* the thing works. Often a metaphor or a precise mechanism. Example: "density manufactures product-market fit" or "MCP-native — the moat is in the protocol, not the marketing copy."

Pair with 1–3 supporting stats and a 2-paragraph explainer.

### 5. The plan

Concrete: phases (use the `Timeline` component), timelines, communities or audiences you'll engage. Use `Community` tiles for "where we'll show up."

If the plan is more than 4 phases, the reader will skim. Keep it tight.

### 6. Prior art / case studies

Four `CaseStudy` tiles minimum. Each: company / year / one-line play / one-line result / source link. The reader should think "okay, this isn't an improvisation."

If you can't find four real precedents, your insight is probably wrong.

### 7. What we're committing

The most-underused section. Make it explicit: **one commitment** + **two working hypotheses**. Use three `Stat` tiles with caveats. Below, in italic: "real envelope = X; don't make hasty assumptions."

This builds trust faster than any other single move. You're naming what you don't yet know.

### 8. Tension beat

A `Section` with `tone="ink"` (dark background). One dramatized statistic — "88% of agent pilots fail" — followed by 2–3 bullets on the specific discipline that addresses it. The contrast makes the discipline feel earned.

Use sparingly. One tension beat per page.

### 9. Resolution / stage-gate

The pre-committed decision rule. Three tile cards: ≥4 of 6 → fuel · 3 → extend · ≤2 → pivot. Plus a one-line list of the criteria below.

This section is what separates a plan from a vibe.

### 10. The ask

Numbered `Decision` rows in one or two columns. Each: short title + one-line description + ratification chips (`✅ On board · ⚠️ Concern · ❌ Object`). Footer: "default = ship."

5–17 decisions is the right range. Fewer = you haven't done the work. More = readers won't engage with all of them.

### 11. How to engage

Three response channels: reply directly · drop into a team thread · take a meeting slot. Use a 3-column grid with icons.

End with the line: "If you finish reading and have no objections, we haven't written it well enough."

### 12. Honest gap list

What you didn't solve. Often 20–30 items, grouped (strategic / product / GTM / measurement). Tag each: MUST before Phase 1 · SHOULD before Phase 2 · DEFER.

Counter-intuitive: this section *increases* reader confidence. Naming the gaps explicitly proves you've done the work and aren't bullshitting.

---

## Voice and tone

- **Declarative, not aspirational.** "We will launch four communities the same week" beats "We believe in the power of community."
- **Specific numbers > round numbers.** "¥30M ARR" beats "meaningful revenue." If you don't know, say "working hypothesis."
- **Mark hypotheses explicitly.** Don't pretend uncertain numbers are commitments. The reader can tell.
- **Italics for asides and reframes.** Use them like a writer would, not like a designer would.
- **Bold for the load-bearing claim per paragraph.** Not for emphasis-as-decoration.
- **Sentence-case headings.** Title-case feels corporate.

---

## What not to do

- ❌ Walls of paragraph copy with no tiles, stats, or visual rhythm
- ❌ "Synergy," "leverage," "innovative," "world-class," or any phrase that survives copy-paste between two unrelated decks
- ❌ Pretending you have answers you don't — readers always sniff this out
- ❌ Linking to private repos, Notion docs, or Linear tickets from a stakeholder-facing page (screenshot risk)
- ❌ More than 13 sections on one page — at that point split into two pages or cut content
