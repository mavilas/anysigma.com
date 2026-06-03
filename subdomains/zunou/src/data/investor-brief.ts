// Single source of truth for the Zunou investor brief.
// Imported by:
//   - /investors            (Astro mini-site, reader-friendly)
//   - /investors/present    (Reveal.js deck, 16:9 presentation)
//   - /investors/talk       (speaker notes, references the same content)
//
// When the pitch sharpens, edit here. Both reader and deck re-render.

export const LAST_SYNCED = "2026-06-03";

// --- The argument · long-form prose (reader page; accent-bordered card) ---
export const argument = `The exec chief-of-staff surface is the next category to consolidate in workplace software. Microsoft Copilot wins the Microsoft-stack enterprise; Glean wins enterprise search. Neither serves the Slack-native, Google-native team that is the modal modern startup, the modal VC fund, and the modal small operations team inside larger orgs. Zunou is built for that team, globally. The product is launched, MCP-native, with 136 production agent tools, a Voice Agent on OpenAI Realtime, and autonomous async Relays. We are based in Tokyo because that is where Marco is and where the warm-network density is highest, which is why the first GTM wave runs through Indelible Ventures (Malaysia, confirmed) into TAI Tokyo (4,000+ AI builders, Ilya-introduced, late July or early August 2026) and then into layered communities. Pre-committed stage-gate February 2027: 4 of 6 PMF criteria triggers fuel, 2 or fewer triggers a pivot, 3 triggers a 60-day extension. PMF first. ARR follows.`;

// --- The argument · slide treatment (deck only; 4 cards + closing) --------
// On the deck this becomes: H2 + lede + 2x2 grid of 4 cards + closing line.
// Each card is one of the 4 ideas the long-form paragraph compresses together.
export const argumentSlide = {
  h2: "The exec chief-of-staff surface is the next category to consolidate.",
  lede: "Zunou is built for the Slack-native, Google-native team. Globally.",
  cards: [
    {
      label: "What's open",
      title: "Copilot and Glean don't reach our buyer.",
      body: "Copilot wins the Microsoft-stack enterprise. Glean wins enterprise search. The Slack-native, Google-native team (modal modern startup, modal VC fund, modal small ops team) has no dedicated exec-CoS surface.",
    },
    {
      label: "What we ship",
      title: "Launched, MCP-native, deep.",
      body: "136 production agent tools. Voice Agent on OpenAI Realtime. Autonomous async Relays. Embeddable SDK across mobile, web, and event surfaces.",
    },
    {
      label: "Where we land first",
      title: "SEA into Tokyo, then layered communities.",
      body: "Indelible Ventures (Malaysia, confirmed) → TAI Tokyo (4,000+ AI builders, Ilya-introduced, late July or early August 2026) → AI Tinkerers, Venture Café, and a fourth.",
    },
    {
      label: "The discipline",
      title: "Pre-committed February 2027 stage-gate.",
      body: "6 PMF criteria. 4-of-6 met triggers fuel. 2-or-fewer triggers pivot. 3 triggers a 60-day extension. The kill criterion is named in advance.",
    },
  ],
  closing: "PMF first. ARR follows.",
};

// --- Touch It · the demo beachhead (planned for Phase 0, not yet live) ----
export const demoBeachhead = {
  url: "demo.zunou.ai",
  urlLive: false,
  status: "Coming in Phase 0 · not yet live",
  shipWeek: "[Phase 0 · TBD]",
  pitch:
    "A read-only Zunou workspace that ships in Phase 0. Pre-loaded with three weeks of meetings, a 6-person team, and one open follow-up the agent surfaces unprompted. No login, no email. The fastest way to feel why this is different from a Copilot screenshot. For today, walk this section as the commitment we're shipping against, not as a live link.",
  ahaQuote: `"Tanaka-san asked about Q3 ARR last Tuesday. You haven't responded."`,
  seeds: [
    { label: "6 personas", what: "CEO, CoS, investor, portfolio founder, designer, EA. One shared Pulse." },
    { label: "3 weeks of meetings", what: "Pre-baked transcripts, agent debriefs, follow-ups already done" },
    { label: "1 unprompted follow-up", what: "The 5-minute aha moment the agent surfaces without being asked" },
    { label: "Daily morning brief", what: "§10C ritual hook rendered for today's date" },
    { label: "Share-this-view button", what: "Public read-only URL on every artifact (the viral loop)" },
  ],
  whyItMatters:
    "The product stops being a deck. Loom's playbook: every shared artifact is the ad. After this beat, the meeting changes register.",
};

// --- §01 The product is real ----------------------------------------------
export const productStats = [
  { stat: "136", label: "Agent tools", body: "Server-side in the Lambda AI Proxy. Never exposed to clients. Competitors can't reverse-engineer." },
  { stat: "15", label: "Data sources", body: "Slack, GitHub, Jira, Google Calendar, Gmail, Zunou-native. Pluggable per archetype." },
  { stat: "12", label: "Home widgets", body: "Executive, maker, focus, meeting-heavy, minimal. Smart-hide rules per template." },
];

export const productCapabilities = [
  { icon: "mic", title: "Voice Agent · OpenAI Realtime", body: "18 languages. Same brain as text. Conversation context persists into the Pulse." },
  { icon: "workflow", title: "Autonomous Relays", body: "Async, goal-driven, tool-using. Continues working between sessions. Same agent runtime, different cadence." },
  { icon: "network", title: "MCP-native", body: "Read-access to the muted channels operators already live in (WhatsApp, LINE, Slack). Habit replacement happens by gravity, not migration ask." },
  { icon: "layers", title: "Embeddable Agent SDK", body: "Same brain in Dashboard, Nova (mobile/PWA/iOS), and event surfaces. Ship a new beachhead as a manifest, not a sprint." },
];

// --- §02 Why now ----------------------------------------------------------
export const whyNow = [
  { label: "Category opening", title: "MCP is the iPhone-app-store moment for agents.", body: "The MCP standard makes agent runtimes interoperable for the first time. Surfaces that get built now compound; surfaces built after consolidation hits become features inside someone else's product. 18-month window." },
  { label: "Open surface", title: "Copilot and Glean don't reach our buyer.", body: "Copilot owns the Microsoft-stack enterprise. Glean owns enterprise search. The Slack-native, Google-native team (modal modern startup, modal VC fund, modal small ops team) has no dedicated exec-CoS surface today. Globally." },
  { label: "Wedge", title: "MCP triage replaces by gravity.", body: "Operators already mute the group chats they live in (Slack, WhatsApp, LINE, Discord). Zunou's agent digests the muted channels via MCP read-access. They keep their habits and stop missing value. Platform replacement happens without a migration ask." },
];

// --- §03 Beachhead waves --------------------------------------------------
export const beachheads = [
  {
    n: 0,
    status: "confirmed",
    label: "Beachhead 0 · confirmed",
    title: "Indelible Ventures · Kevin Brockland · Malaysia",
    body: "First confirmed external user. Three sequenced use cases mapped from the recent meeting: (1) portfolio knowledge hub for 20 to 40 founders, (2) AI Salon Thailand event-spaces, (3) Founder Institute Thailand alumni re-engagement. North Base Media and Headline Ventures queued as the second Beachhead 0 wave if signal warrants.",
    link: { href: "/pilots/indelible", label: "Pilot prep doc" },
  },
  {
    n: 1,
    status: "scheduled",
    label: "Beachhead 1 · scheduled",
    title: "TAI Tokyo · Ilya-introduced · late July / early August 2026",
    body: "4,000+ AI builders. Open membership. Weekly events. Partner-curated cohort, not a broadcast launch. Density manufactures product-market fit; one well-bonded community out-converts ten loose ones.",
  },
  {
    n: 2,
    status: "staged",
    label: "Beachhead 2 · staged",
    title: "Layered Tokyo communities",
    body: "AI Tinkerers, Venture Café Toranomon, and a fourth. 6,500 reachable Tokyo individuals across 13 prioritized communities. Hybrid venue sponsorship (flat fee plus per-user-join bonus) pays for actual conversion, not seats.",
  },
];

export const stageGate = {
  label: "Pre-committed stage-gate · February 2027",
  body: "6 PMF criteria. 4 or more met triggers fuel (Beachhead 2 expansion + content / PR / partnerships in parallel). 2 or fewer triggers a pivot conversation. 3 triggers a 60-day extension. The kill criterion is pre-committed because discipline beats hope when the data is mixed.",
};

// --- §04 Horizon ----------------------------------------------------------
export const horizon = [
  { label: "Months 1 to 3 · Activation", title: "Does the product produce dense behavior?", body: "Magic-number completion, cohort retention, qualitative 'very disappointed' signal." },
  { label: "Months 3 to 6 · Paid validation", title: "Do people pay? At what tier?", body: "First paying logos, Pro $19 vs Business $39 preference, willingness-to-pay, early churn." },
  { label: "Months 6 to 12 · Compound", title: "Do parallel tracks compound?", body: "Communities, events, content, PR, partnerships. MoM acceleration. ARR number locks here, conditional on activation and paid signal earned in months 1 to 6.", highlight: true },
];

// --- §07 Where we'd value your view (the 7 open calls) ---------------------
export const openCalls = [
  { n: "01", title: "Year-1 ambition framing", body: "ARR locks after month-3 paid signal. Financial model is still being built. Aggressive (compound), conservative (linear), or held until paid validation?" },
  { n: "02", title: "Which 3 capabilities lead the demo", body: "From 136 tools, the TAI pilot leads with 3. Daily Debrief and Voice Agent are settled. Third slot: Relays, Spaces, or Brain Dump?" },
  { n: "03", title: "The magic number itself", body: "5 events + 1 magic moment + 3 returns in 14 days is the hypothesis. Right shape? Or should Daily Debrief / Relays / Spaces joins be the substitution?" },
  { n: "04", title: "Event-Space personal-conversion rate", body: "10% is the investor-doc working number for personal-conversion from event installs. Tokyo-specific actual TBD. Where would you set the planning floor?" },
  { n: "05", title: "Loop 6 · meeting-prep viral loop", body: "Loom rode the shared-artifact loop to 25M users. Worth product-eng investment now, or after PMF? Your read on the timing." },
  { n: "06", title: "Support model v0", body: "Marco + Malek covering JP/EN business hours; in-app widget + customer pulse inside Zunou itself (dogfood). First CSM hire after day-180. Aggressive or right-sized?" },
  { n: "07", title: "Do parallel tracks compound or run linearly?", body: "Biggest unknown. Year-1 plan assumes communities + events + content + PR compound in months 6-12. Linear math changes everything. Your read on which way you've seen this go?" },
];

export const closingStatement = {
  headline: "Tell us where we're wrong.",
  body: "We've made these calls and we're shipping against them. Wherever you'd take a different position, that's the most useful thing you can give us today.",
};

// --- Closing artifact: what happens next (fills the dark closing slide) ---
export const whatHappensNext = [
  {
    when: "This week",
    what: "Brief shared. Pilot prep doc + readiness audit open for your read at zunou.anysigma.com/pilots/indelible.",
  },
  {
    when: "Phase 0 · 4-6 weeks",
    what: "Pre-flight clears (iOS auth, web DM, notification outbox). Demo workspace ships at demo.zunou.ai (planned, not yet live).",
  },
  {
    when: "Late July · early August 2026",
    what: "Beachhead 1 opens. TAI Tokyo pilot launches. Ilya-introduced cohort. First magic-number read at day 14.",
  },
];

// --- Talk track (7 beats, 20 minutes) — kept here for cross-reference.
// talk.astro renders its own structured beats with hits + speaker notes;
// this export is for any future tooling that wants a flat list. ----------
export const talkTrack = {
  totalMin: 20,
  beats: [
    { range: "0 to 2", title: "The argument", anchor: "#argument" },
    { range: "2 to 5", title: "Touch it · the demo", anchor: "#touch" },
    { range: "5 to 8", title: "The product is real", anchor: "#product" },
    { range: "8 to 11", title: "Why now", anchor: "#why-now" },
    { range: "11 to 14", title: "Beachheads", anchor: "#beachheads" },
    { range: "14 to 16", title: "Horizon", anchor: "#horizon" },
    { range: "16 to 20", title: "Where we'd value your view", anchor: "#views" },
  ],
};
