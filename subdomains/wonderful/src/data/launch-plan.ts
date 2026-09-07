// Single source of truth for the Wonderful Japan launch plan.
// Imported by:
//   - /launch-plan          (Astro mini-site, reader-friendly)
//   - /launch-plan/present  (Reveal.js deck, 16:9 presentation)
//
// When numbers change, edit here. Both views re-render.
// Verified 2026-06-02 against: TechCrunch / Bloomberg / Index Ventures (funding),
// IPSS 2023 projection (demographics), METI SME Agency (99.7%),
// HF Rakuten AI 3.0 model card, METI AI & Semiconductor framework.

export const LAST_SYNCED = "2026-06-02";

export const FX_JPY_USD = 150;
export const usd = (jpyB: number) =>
  `~$${(jpyB / FX_JPY_USD).toFixed(1).replace(/\.0$/, "")}B`;

// --- §01 Executive Summary -------------------------------------------------
export const execSummary = [
  {
    stat: "$286M",
    label: "The Global Foundation",
    body: "$150M Series B at $2B (Mar 2026), four months after $100M Series A. Lead: Insight Partners.",
    sub: [
      "30+ countries live · 80+ enterprise customers",
      "Containment rates >80% in production deployments",
    ],
  },
  {
    stat: "$1B+",
    label: "The Japan Opportunity",
    body: "Projected TAM for Agentic AI, driven by severe labor shortages and a demographic decline.",
    sub: [
      "Targeted universe of 500 mega-sized enterprises",
      "Must-Win Accounts: 155 priority targets",
      "Urgent shift from legacy RPA to autonomous workflows",
    ],
  },
  {
    stat: "90 Days",
    label: "The Acceleration Strategy",
    body: "Aggressive parallel execution sprint targeting first paid revenue in just 6-8 months.",
    sub: [
      "Bypassing standard 12-month procurement delays",
      "Legal, Talent, and Pipeline tracks in strict parallel",
    ],
  },
];

// --- §02 Global Momentum ---------------------------------------------------
export const globalProof = [
  { stat: "$286M", label: "Total raised", body: "$150M Series B at $2B (Mar 2026), four months after $100M Series A. Insight, Index, IVP, Bessemer, Vine.", icon: "landmark" },
  { stat: "30+", label: "Countries live", body: "EMEA · APAC · Americas. Embedded country teams, not pure SaaS.", icon: "globe" },
  { stat: "80+", label: "Enterprise customers", body: "Telco · BFSI · healthcare · manufacturing. Production deployments.", icon: "building-2" },
  { stat: "<5%", label: "Annual logo churn", body: "World's lowest enterprise SaaS churn. Bezeq retained at scale.", icon: "shield" },
  { stat: ">80%", label: "Containment rate", body: "Wonderful-reported across production deployments. Replaces legacy automation vendors.", icon: "gauge" },
  { stat: "70%", label: "Multi-workflow expansion", body: "European customers expand to new workflows within 3 months.", icon: "git-merge" },
];

// --- §03 Demographic Crisis (IPSS 2023) ------------------------------------
export const demographics = [
  { year: "2010", actual: true,
    bands: [
      { label: "Under 20", value: 23.0, pct: 18 },
      { label: "Working age (15-64)", value: 79.2, pct: 62, highlight: true },
      { label: "65 +", value: 25.8, pct: 20 },
    ], total: 128.0 },
  { year: "2025", actual: false,
    bands: [
      { label: "Under 20", value: 20.6, pct: 16 },
      { label: "Working age (15-64)", value: 70.5, pct: 56, highlight: true },
      { label: "65 +", value: 35.4, pct: 28 },
    ], total: 126.5 },
  { year: "2040", actual: false, projection: true,
    bands: [
      { label: "Under 20", value: 17.0, pct: 15 },
      { label: "Working age (15-64)", value: 60.0, pct: 53, highlight: true },
      { label: "65 +", value: 36.9, pct: 32 },
    ], total: 113.9 },
];
export const workingAgeDelta = demographics[0].bands[1].value - demographics[2].bands[1].value;
export const workingAgePctChange = Math.round((workingAgeDelta / demographics[0].bands[1].value) * 100);

// --- §04 Macro Catalyst ----------------------------------------------------
export const macroCatalyst = [
  { label: "Demographic Crisis", sublabel: "Driver", icon: "users",
    body: "Rapidly aging population and shrinking workforce creating unprecedented labor shortages." },
  { label: "Government Intervention", sublabel: "Catalyst", icon: "landmark",
    body: "2025 AI Promotion Act and centralised AI Strategy HQ established.",
    detail: "¥10 Trillion (~$65B) investment framework to 2030; GENIAC funding domestic LLMs." },
  { label: "Enterprise Reality", sublabel: "Outcome", icon: "factory",
    body: "Urgent shift from legacy RPA to end-to-end Agentic AI to replace white-collar shortfalls.",
    detail: "$5-6B Agentic AI TAM; enterprise adoption accelerating at 30-40%." },
];

// --- §05 Why Japan running fast --------------------------------------------
export const japanMarket = {
  rank: "#3",
  rankLabel: "Global enterprise SaaS market by spend",
  chart: [
    { year: "2024", value: 180 },
    { year: "2025", value: 290 },
    { year: "2026", value: 480 },
    { year: "2027", value: 720 },
    { year: "2028E", value: 980 },
  ],
  highlights: [
    { stat: "<5%", label: "Annual enterprise logo churn. World's lowest." },
    { stat: "2.4×", label: "Avg. Japan enterprise ACV vs APAC peers." },
  ],
};

// --- §06 Competitive Landscape ---------------------------------------------
export const competitors = [
  { name: "Rakuten AI 3.0",
    them: "700B-param MoE. Integrated ecosystem focus.",
    us: "Production ROI over model-building. We plug directly into existing tech infrastructures." },
  { name: "NEC cotomi LLM",
    them: "Specialised, single-task workflow automation.",
    us: "Multi-workflow orchestration. 70% of clients expand to new workflows within 3 months." },
  { name: "Fujitsu Kozuchi AI",
    them: "Multi-AI agent collaboration trials and localised POCs.",
    us: "Europe-proven track record of at-scale enterprise deployments, bypassing sandbox trials." },
  { name: "Sakana AI",
    them: "Nature-inspired, highly secure Japanese LLMs.",
    us: "Keigo-native deployment combined with a consumption-only commercial model (virtually zero adoption barrier)." },
];

// --- §07 Strategic Pillars -------------------------------------------------
export const pillars = [
  { title: "Credibility", icon: "crown",
    items: [
      "Strong, credible local leadership commanding C-suite respect.",
      "Flawless cultural execution and Japanese-grade UX.",
      "Delivering actual production ROI, refusing to do sandbox POCs.",
    ] },
  { title: "Long-Term Commitment", icon: "heart-handshake",
    items: [
      "Aligning tightly with central government objectives (2025 AI Promotion Act).",
      "Heavy localised investment in Keigo-correct language capabilities.",
      "Providing a dedicated AI enablement layer with local implementation teams.",
    ] },
  { title: "Clear Differentiated Value", icon: "award",
    items: [
      "Supporting regulators to ensure highly compliant, trustworthy deployments.",
      "Strict adherence to data sovereignty, governance, and security compliance.",
      "Fully-generative agents capable of handling complex workflows autonomously.",
    ] },
];

// --- §08 JP Enterprise Market Architecture ---------------------------------
export const industryMix = [
  { color: "var(--color-accent)", pct: 40, label: "Manufacturing", co: "Toyota, Sony, Panasonic" },
  { color: "#7a5cff", pct: 20, label: "Distribution & Retail", co: "Seven & i, Aeon, Uniqlo" },
  { color: "#0b8f6b", pct: 15, label: "Finance & Insurance", co: "MUFG, Mizuho, Tokyo Marine" },
  { color: "var(--color-accent-ink)", pct: 15, label: "Service & Infrastructure", co: "NTT, JR East, Recruit" },
  { color: "var(--color-ink-soft)", pct: 10, label: "Construction & Real Estate", co: "" },
];

// --- §09 Pipeline Funnel ---------------------------------------------------
export const funnel = [
  { count: 500, label: "Japan Enterprise · universe of mega-cap targets" },
  { count: 155, label: "Must-Win List · GM curated by fit, budget, speed" },
  { count: 48, label: "Tier 1 Priorities · highest-value, highest-fit accounts" },
  { count: 5, label: "FY26 Win Targets · $5M ARR by Dec 2026" },
];

export const pocTracks = [
  { name: "Track 1 · Innovation Lab PoCs",
    target: "CDO + Innovation Heads",
    edge: "Fast budget access, low procurement friction.",
    proof: "Champions hungry for a quick win." },
  { name: "Track 2 · DX Mandate PoCs",
    target: "CIO + Digital Transformation Office",
    edge: "Board-level pressure to ship visible, structural AI outcomes.",
    proof: "Aligned to ringi-friendly transformation budgets." },
];


// --- §11 Launch Team + Hiring ---------------------------------------------
export const coreSquad = [
  { role: "President", name: "Satoshi Hosoi", note: "Policy, lobbying, C-level relations" },
  { role: "General Manager", name: "Hiroshi Ando", note: "Daily ops, HQ collaboration" },
  { role: "Field CTO", name: "TBD", note: "Senior technical lead" },
  { role: "Technical Lead", name: "Marco Avila", note: "Tech delivery, HQ collaboration, JP-fit engineering" },
];

export const hiringPhasing = [
  { q: "Q1", focus: "Leadership hiring", goal: "Establishing credibility + entity" },
  { q: "Q2", focus: "Technical deployment team", goal: "Securing production capabilities" },
  { q: "Q3", focus: "Sales and partnership team", goal: "Scaling revenue pipeline" },
  { q: "Q4", focus: "Customer success and scaling", goal: "Protecting and expanding accounts" },
];

// --- §12 Risks -------------------------------------------------------------
export const risks = [
  { risk: "Talent Scarcity", icon: "users",
    framing: "High risk of mis-hires in a notoriously thin, premium senior talent pool. Wave-1 team must be flawless.",
    mitigation: "Elite retained search engaged pre-entity. Mandatory HQ founder interview gate. Strict 90-day performance reviews." },
  { risk: "Enterprise Procurement Drag", icon: "gauge",
    framing: "Default B2B enterprise procurement cycles in Japan take 6-12 months, destroying startup momentum.",
    mitigation: "Surgically targeting agile Innovation/DX budgets. Mandating CEO-sponsored PoCs. Deploying MS partner co-selling mechanisms." },
  { risk: "Language & Cultural Rejection", icon: "languages",
    framing: "Failure in keigo, particles, or strict business etiquette instantly destroys trust. This is a product failure, not just bad marketing.",
    mitigation: "Strict keigo-aware agent quality bar with native reviews. Japanese-grade UX architecture. Native delivery team operating from Day 1." },
];

// --- §13 HQ Asks -----------------------------------------------------------
export const hqAsks = [
  { num: "01", title: "Fast-track Legal Turnaround",
    ask: "48-hour SLA on Japan contract reviews.",
    impact: "Pre-approved MSA, NDA, and DPA templates owned entirely by the local Japan team to bypass time-zone bottlenecks and red tape." },
  { num: "02", title: "Budget Flex for Top Candidates",
    ask: "Authorisation to stretch 10-15% above standard bands for Wave-1 hires.",
    impact: "A+ talent in Japan is a market premium, not a discount. Securing elite founding talent immediately accelerates the entire 12-month roadmap." },
  { num: "03", title: "Executive Sponsorship",
    ask: "HQ Founders commit to supporting top talent interviews.",
    impact: "Warms up elite candidates prior to KK entity completion, maintaining critical recruiting momentum during the Pre-Entity phase." },
];
