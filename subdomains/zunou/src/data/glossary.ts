// Glossary — every acronym / strategic term used in the proposal.
// Used by:
//   - <Term name="KGI" /> inline tooltip wrapper on first mentions
//   - The Glossary section (#glossary) at the end of the page
//
// Schema:
//   short  — one-line tooltip-sized definition (≤140 chars)
//   long   — fuller paragraph for the glossary section
//   jp     — original Japanese term where relevant
//   group  — UI category for the glossary section grouping

export interface GlossaryEntry {
  short: string;
  long: string;
  jp?: string;
  group: "metric" | "japanese" | "growth" | "product" | "physics" | "ai";
}

export const glossary: Record<string, GlossaryEntry> = {
  // === Metrics & strategy ===
  KGI: {
    jp: "重要目標達成指標",
    short:
      "Key Goal Indicator — Japanese-standard top-level board commitment. The single number the company is held to.",
    long: "Key Goal Indicator (重要目標達成指標) is the top-level outcome the company commits to. In Japanese strategy practice it sits above NSM and KPIs. Ours is ¥30M ARR within 12 months of synchronized launch.",
    group: "metric",
  },
  NSM: {
    short:
      "North Star Metric — the single product metric that proxies for healthy growth. Tracks weekly.",
    long: "North Star Metric — the single product metric that most closely tracks the value users get. Connects KGI (lagging) to KPIs (leading). Ours: weekly active users past the magic number, in a partner community.",
    group: "metric",
  },
  KPI: {
    short:
      "Key Performance Indicator — leading metrics we manage weekly. They roll up to NSM, which rolls up to KGI.",
    long: "Key Performance Indicator — the weekly-tracked leading metrics (activation rate, time-to-calendar-connect, W4 retention, etc.) that roll up into NSM. See §11 (Stage-gate) for our specific six.",
    group: "metric",
  },
  PMF: {
    short:
      "Product-Market Fit — the moment the product visibly pulls users in rather than being pushed at them.",
    long: "Product-Market Fit — the point where customers pull the product through the funnel instead of being pushed. Often invisible from inside but unmistakable from outside.",
    group: "metric",
  },
  ARR: {
    short:
      "Annual Recurring Revenue — predictable subscription revenue normalised to a yearly figure.",
    long: "Annual Recurring Revenue — the yearly value of subscription contracts. Standard B2B SaaS health metric. ¥30M ARR ≈ US$200k.",
    group: "metric",
  },
  MoM: {
    short: "Month-over-Month — growth rate from one month to the next.",
    long: "Month-over-Month growth rate — (this month − last month) / last month. We commit to ≥20% MoM in the second half of the launch window.",
    group: "metric",
  },
  ICP: {
    short:
      "Ideal Customer Profile — the specific type of company / user we're built for.",
    long: "Ideal Customer Profile — the company / user we're built for and who we deliberately target. Ours: founder-led English-tolerant Tokyo scale-ups.",
    group: "metric",
  },
  WAU: {
    short: "Weekly Active Users — users who took meaningful action this week.",
    long: "Weekly Active Users — users who engaged within the rolling 7-day window. We use this for NSM rather than DAU (daily) because executive use patterns are weekly, not daily.",
    group: "metric",
  },
  DAU: {
    short: "Daily Active Users — users who took action today.",
    long: "Daily Active Users — meaningful action within 24h. DAU/WAU ratio is a 'stickiness' indicator.",
    group: "metric",
  },
  AU: {
    short: "Active User — used as denominator in per-user cost calculations.",
    long: "Active User — a single engaged user. Our inference budget is expressed per active user per month (¥600/AU/mo on free tier).",
    group: "metric",
  },

  // === Growth & Product ===
  "Magic number": {
    short:
      "The activation threshold past which user behavior visibly shifts and retention spikes.",
    long: "The threshold (defined per product) above which retention jumps. Slack: 2,000 messages. Facebook: 7 friends in 10 days. Ours (v0 hypothesis): 5 colleagues from same community + 1 calendar + 3 AI actions accepted, in 14 days.",
    group: "growth",
  },
  Density: {
    short:
      "Enough overlapping users in a defined group for the product's value to compound.",
    long: "Zunou-specific term — the condition where enough colleagues in the same community / team are using the product that its AI has the cross-context it needs to be useful. The product IS the density.",
    group: "growth",
  },
  PLG: {
    short:
      "Product-Led Growth — distribution where the product itself drives signups and expansion.",
    long: "Product-Led Growth — go-to-market where the product (free tier + self-serve onboarding) does the selling. Notion, Linear, Figma, Slack all archetypal PLG.",
    group: "growth",
  },
  CLG: {
    short:
      "Community-Led Growth — distribution where engaged community members drive new signups.",
    long: "Community-Led Growth — distribution model where the user community generates referrals, content, social proof. Often paired with PLG.",
    group: "growth",
  },
  "Member-of-N": {
    short:
      "A user active in N partner communities. Our percolation indicator across the launch graph.",
    long: "A Zunou-specific KPI: the % of weekly active users who are members of 2+ partner communities. Tracks the cross-community percolation effect from the sympathetic-detonation launch.",
    group: "growth",
  },

  // === Physics / network theory ===
  "Sympathetic detonation": {
    short:
      "Physics term — adjacent explosive charges igniting each other through shockwave coupling.",
    long: "Physics term used for our launch mechanic. When multiple communities with overlapping members are launched in the same week, attendance at one triggers attendance at another. Adjacent fuses light each other.",
    group: "physics",
  },
  "Percolation threshold": {
    short:
      "Statistical physics — the point at which disconnected clusters merge into one giant connected component.",
    long: "Statistical physics concept describing when adding edges to a graph causes the structure to flip from sparse disconnected clusters into one giant connected component. Our 4-community launch is engineered to cross this threshold inside Tokyo's English-speaking founder graph.",
    group: "physics",
  },

  // === AI / technical ===
  MCP: {
    short:
      "Model Context Protocol — open standard for AI systems to read/write external tools and data (Slack, Notion, Linear, etc.). Industry-default since early 2026.",
    long: "Model Context Protocol — open standard introduced by Anthropic in Nov 2024, adopted by OpenAI / Microsoft / Google in 2025–26, donated to the Linux Foundation in Dec 2025. 10,000+ public servers exist. Zunou is MCP-native.",
    group: "ai",
  },
  HITL: {
    short:
      "Human-in-the-loop — design pattern where AI proposes but a human confirms before any external action.",
    long: "Human-in-the-Loop — AI proposes / drafts, humans confirm before any externally-visible action (sending email, posting to Slack, creating events). Our discipline against the 88% agent-pilot failure rate.",
    group: "ai",
  },
  LLM: {
    short:
      "Large Language Model — Claude, GPT, Gemini, etc. The AI systems Zunou orchestrates.",
    long: "Large Language Model — the family of AI systems (Claude / GPT / Gemini / Llama / Mistral / etc.) that Zunou routes through MCP-mediated context for each task.",
    group: "ai",
  },
  PWA: {
    short:
      "Progressive Web App — a website that installs and behaves like a native app.",
    long: "Progressive Web App — a web app that installs to the user's home screen, runs offline, sends push notifications. Zunou's current shipping surface is a PWA.",
    group: "product",
  },

  // === Japanese terms ===
  Ringi: {
    jp: "稟議",
    short:
      "Japanese consensus-based written approval process. Documents circulate bottom-up through hierarchy.",
    long: "稟議 (ringi) — the standard Japanese corporate decision process: a written proposal (ringisho) circulates from lower-level employees upward, each stamping approval, before a final senior sign-off. Slow but builds organisational buy-in. Zunou's Ringi-automation alpha is a defensible JP-specific feature.",
    group: "japanese",
  },
  Keigo: {
    jp: "敬語",
    short:
      "Japanese honorific speech. Required for any AI output that becomes external-facing.",
    long: "敬語 (keigo) — Japanese honorific speech system, with three registers: teineigo (polite), sonkeigo (respectful, for the listener), kenjogo (humble, for the speaker). External-facing communication that gets keigo wrong reads as offensive. The Zunou wedge against Notion AI / Slack AI / Copilot.",
    group: "japanese",
  },
  APPI: {
    short:
      "Act on the Protection of Personal Information — Japan's primary data privacy law. 2025–26 enforcement-focused regime.",
    long: "Act on the Protection of Personal Information — Japan's primary data privacy law. The 2025–26 amendments add administrative penalties and stricter cross-border transfer rules. Required compliance for any JP enterprise customer.",
    group: "japanese",
  },
  METI: {
    short:
      "Japan Ministry of Economy, Trade and Industry — runs national AI policy and SME subsidies.",
    long: "経済産業省 — Japan's Ministry of Economy, Trade and Industry. Runs national AI strategy and the SME AI subsidy programs (50–66% project cost reimbursement, ¥300k–¥4.5M per grant). JP-companies are eligible.",
    group: "japanese",
  },
  IVS: {
    short:
      "Infinity Ventures Summit — Japan's largest startup conference. Annual in Kyoto, July.",
    long: "Infinity Ventures Summit — Japan's largest startup conference, held annually in Kyoto (July). 60+ alumni exits, freee and COVER among them. Organised by Headline Asia. Phase 2 of our rollout is anchored here.",
    group: "japanese",
  },
  TAI: {
    short:
      "Tokyo AI — Japan's largest technical AI community. 4,000+ members. Launch community #1.",
    long: "Tokyo AI (TAI) — the largest technical AI community in Japan. Engineers, researchers, investors, PMs. Founded by Ilya Kulyatin. Monthly meetups + Connpass + Slack. 4,000+ members as of May 2026.",
    group: "japanese",
  },
  AiSalon: {
    short:
      "AiSalon Tokyo — AI-focused founder community, JETRO-backed, partnered with TAI.",
    long: "AiSalon Tokyo — global community for AI-focused founders, builders, investors. Tokyo chapter co-hosted with Tokyo AI, JETRO-supported. Monthly in-person events with lightning talks.",
    group: "japanese",
  },
  JETRO: {
    short:
      "Japan External Trade Organization — government soft-landing program for foreign business / startups in JP.",
    long: "Japan External Trade Organization — government-affiliated agency that supports foreign business with entry into Japan and Japanese business expansion globally. Free advisory; useful for non-JP companies setting up. Less relevant for Zunou (we're JP-native) except for inbound advisor relationships.",
    group: "japanese",
  },

  // === Business / process ===
  MoU: {
    short:
      "Memorandum of Understanding — non-binding written agreement that signals intent.",
    long: "Memorandum of Understanding — a written but typically non-binding agreement that signals commitment. Used in our portfolio-as-community play for the GP-Zunou agreement.",
    group: "product",
  },
  MoSCoW: {
    short:
      "Prioritization framework: Must / Should / Could / Won't-this-time.",
    long: "Prioritization framework that buckets work into Must (do now), Should (after must), Could (if time), Won't (this cycle). Used in product-requirements.md to tier features for Phase 0 / 1 / 2 / deferred.",
    group: "product",
  },
  OAuth: {
    short:
      "Open authorization — standard for granting third-party access to your accounts.",
    long: "Open Authorization — the protocol that lets you grant a third-party (like Zunou) access to your Google Calendar or Slack workspace without sharing your password. Foundation of all modern integrations.",
    group: "product",
  },
  SaaS: {
    short:
      "Software-as-a-Service — subscription-based software delivered over the internet.",
    long: "Software-as-a-Service — the dominant B2B software model: web-delivered, subscription-priced, continuously updated. Zunou is SaaS.",
    group: "product",
  },
  CSM: {
    short:
      "Customer Success Manager — the human who helps customers actually adopt and succeed with the product.",
    long: "Customer Success Manager — a role responsible for post-sale customer adoption, retention, and expansion. Decision 15 commits to delaying our first CSM hire to post-day-180 stage-gate.",
    group: "product",
  },
  GTM: {
    short:
      "Go-to-Market — the strategy and tactics for getting a product to its target users / buyers.",
    long: "Go-to-Market — the strategy for launching, positioning, distributing, selling a product. This whole proposal is Zunou's Japan-led GTM plan.",
    group: "product",
  },
  CDN: {
    short:
      "Content Delivery Network — globally-distributed servers that cache and serve content close to users.",
    long: "Content Delivery Network — distributed servers around the world that cache static content close to users for fast delivery. Cloudflare runs one of the largest. zunou.anysigma.com is served from it.",
    group: "product",
  },
};

// Sorted glossary keys for the rendered Glossary section.
export const groupTitles: Record<GlossaryEntry["group"], string> = {
  metric: "Metrics & strategy",
  growth: "Growth & product",
  physics: "Physics & network theory",
  ai: "AI & technical",
  japanese: "Japan-specific",
  product: "Business & process",
};

export const groupOrder: GlossaryEntry["group"][] = [
  "metric",
  "growth",
  "physics",
  "ai",
  "japanese",
  "product",
];
