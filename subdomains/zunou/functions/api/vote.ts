// POST /api/vote — authenticated viewers submit a vote on a decision.
// Auth: relies on Cloudflare Access injecting Cf-Access-Authenticated-User-Email.
// Storage: per-user key — vote:<email>:<decisionId> in KV. Latest write wins.

interface Env {
  ZUNOU_VOTES: KVNamespace;
}

interface VoteBody {
  decision: string;
  vote: "on-board" | "concern" | "object";
}

const VALID_VOTES = new Set(["on-board", "concern", "object"]);
const DECISION_RE = /^d([1-9]|1[0-7])$/; // d1..d17

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const email = ctx.request.headers.get("cf-access-authenticated-user-email");
  if (!email) return json({ error: "unauthorized" }, 401);

  let body: VoteBody;
  try {
    body = (await ctx.request.json()) as VoteBody;
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  if (!body || typeof body !== "object")
    return json({ error: "invalid body" }, 400);
  if (!body.decision || !DECISION_RE.test(body.decision))
    return json({ error: "invalid decision id" }, 400);
  if (!body.vote || !VALID_VOTES.has(body.vote))
    return json({ error: "invalid vote" }, 400);

  const record = {
    email,
    decision: body.decision,
    vote: body.vote,
    timestamp: new Date().toISOString(),
    userAgent: ctx.request.headers.get("user-agent") || "",
    country: ctx.request.cf?.country || "",
  };

  const key = `vote:${email}:${body.decision}`;
  await ctx.env.ZUNOU_VOTES.put(key, JSON.stringify(record));

  return json({ ok: true, saved: record });
};

// GET /api/vote — return the requester's own votes (for UI restore on revisit).
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const email = ctx.request.headers.get("cf-access-authenticated-user-email");
  if (!email) return json({ error: "unauthorized" }, 401);

  const list = await ctx.env.ZUNOU_VOTES.list({ prefix: `vote:${email}:` });
  const votes: Record<string, string> = {};
  for (const k of list.keys) {
    const val = await ctx.env.ZUNOU_VOTES.get(k.name);
    if (!val) continue;
    try {
      const rec = JSON.parse(val);
      votes[rec.decision] = rec.vote;
    } catch {
      // skip malformed
    }
  }
  return json({ email, votes });
};
