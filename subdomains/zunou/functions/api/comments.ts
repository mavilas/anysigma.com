// /api/comments — Notion-style threaded comments anchored per section.
// GET  ?anchor=<id>            → comments for one anchor (sorted chronologically)
// GET  (no anchor)             → all comments for the page (anchor-indexed)
// POST body: { anchor, body, parentId? } → create comment / reply
//
// Auth: relies on Cloudflare Access injecting cf-access-authenticated-user-email.
// Local dev fallback: when on localhost/127.0.0.1, honors ?dev_email= or defaults to marco@anysigma.com.
//
// Storage: reuses ZUNOU_VOTES KV namespace under a separate key prefix to avoid
// requiring a new KV namespace for local testing. Production can migrate later.
//   Key   : comments:zunou:<anchorId>
//   Value : JSON array of Comment objects, sorted by createdAt ascending.

interface Env {
  ZUNOU_VOTES: KVNamespace;
}

interface Comment {
  id: string;
  pageId: string;
  anchorId: string;
  parentId: string | null;
  author: string;
  authorName: string;
  body: string;
  createdAt: number;
  editedAt?: number;
  resolved?: boolean;
  // Selection-based anchoring (optional — present on text-selection comments,
  // absent on section-level "discussion" comments).
  quotedText?: string;
  contextBefore?: string;
  contextAfter?: string;
}

const PAGE_ID = "zunou";
const ADMIN_EMAILS = new Set([
  "marco@anysigma.com",
  "mgmafo@gmail.com",
  "majin@anysigma.com",
]);
const MAX_BODY_LEN = 4000;
const ANCHOR_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

const resolveEmail = (req: Request): string | null => {
  const headerEmail = req.headers.get("cf-access-authenticated-user-email");
  if (headerEmail) return headerEmail.toLowerCase();
  // Local dev fallback (only when running on localhost via wrangler pages dev)
  const url = new URL(req.url);
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    const devEmail = url.searchParams.get("dev_email");
    if (devEmail) return devEmail.toLowerCase();
    return "marco@anysigma.com";
  }
  return null;
};

const authorNameFrom = (email: string) => {
  const prefix = email.split("@")[0] || email;
  return prefix.replace(/[._+-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const kvKey = (anchorId: string) => `comments:${PAGE_ID}:${anchorId}`;

const readThread = async (env: Env, anchorId: string): Promise<Comment[]> => {
  const raw = await env.ZUNOU_VOTES.get(kvKey(anchorId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeThread = async (env: Env, anchorId: string, list: Comment[]) => {
  if (list.length === 0) {
    await env.ZUNOU_VOTES.delete(kvKey(anchorId));
  } else {
    await env.ZUNOU_VOTES.put(kvKey(anchorId), JSON.stringify(list));
  }
};

const genId = () =>
  "c_" +
  Math.random().toString(36).slice(2, 10) +
  Date.now().toString(36).slice(-4);

// ---------------- GET ----------------
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const email = resolveEmail(ctx.request);
  if (!email) return json({ error: "unauthorized" }, 401);

  const url = new URL(ctx.request.url);
  const anchor = url.searchParams.get("anchor");

  if (anchor) {
    if (!ANCHOR_RE.test(anchor)) return json({ error: "invalid anchor" }, 400);
    const list = await readThread(ctx.env, anchor);
    return json({ email, anchor, comments: list });
  }

  // No anchor → return all comments grouped by anchor (for the page-load badge counts)
  const list = await ctx.env.ZUNOU_VOTES.list({
    prefix: `comments:${PAGE_ID}:`,
  });
  const byAnchor: Record<string, Comment[]> = {};
  for (const k of list.keys) {
    const anchorId = k.name.split(":")[2];
    if (!anchorId) continue;
    byAnchor[anchorId] = await readThread(ctx.env, anchorId);
  }
  return json({ email, byAnchor });
};

// ---------------- POST ----------------
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const email = resolveEmail(ctx.request);
  if (!email) return json({ error: "unauthorized" }, 401);

  let body: {
    anchor?: string;
    body?: string;
    parentId?: string;
    quotedText?: string;
    contextBefore?: string;
    contextAfter?: string;
  };
  try {
    body = (await ctx.request.json()) as typeof body;
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  const anchor = (body.anchor || "").trim();
  const text = (body.body || "").trim();
  const parentId = body.parentId ? String(body.parentId) : null;
  const quotedText = body.quotedText ? String(body.quotedText) : undefined;
  const contextBefore = body.contextBefore ? String(body.contextBefore) : undefined;
  const contextAfter = body.contextAfter ? String(body.contextAfter) : undefined;

  if (!ANCHOR_RE.test(anchor)) return json({ error: "invalid anchor" }, 400);
  if (!text) return json({ error: "empty body" }, 400);
  if (text.length > MAX_BODY_LEN) return json({ error: "body too long" }, 400);
  if (quotedText && (quotedText.length === 0 || quotedText.length > 1000))
    return json({ error: "quotedText must be 1-1000 chars" }, 400);
  if (contextBefore && contextBefore.length > 200)
    return json({ error: "contextBefore too long" }, 400);
  if (contextAfter && contextAfter.length > 200)
    return json({ error: "contextAfter too long" }, 400);

  const list = await readThread(ctx.env, anchor);

  if (parentId) {
    const parent = list.find((c) => c.id === parentId);
    if (!parent) return json({ error: "parent not found" }, 400);
    if (parent.parentId) return json({ error: "cannot reply to a reply" }, 400);
  }

  const comment: Comment = {
    id: genId(),
    pageId: PAGE_ID,
    anchorId: anchor,
    parentId,
    author: email,
    authorName: authorNameFrom(email),
    body: text,
    createdAt: Date.now(),
  };
  if (quotedText) comment.quotedText = quotedText;
  if (contextBefore) comment.contextBefore = contextBefore;
  if (contextAfter) comment.contextAfter = contextAfter;

  list.push(comment);
  list.sort((a, b) => a.createdAt - b.createdAt);
  await writeThread(ctx.env, anchor, list);

  return json({ ok: true, comment });
};
