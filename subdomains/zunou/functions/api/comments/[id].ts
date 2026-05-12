// /api/comments/:id — edit, resolve, or delete a single comment.
// PATCH  body: { body?: string, resolved?: boolean } → update
// DELETE                                              → delete
//
// Authorship rules
// - body edit            : author only
// - resolved toggle      : author or admin
// - delete               : author or admin
// Deleting a top-level comment also deletes all its replies.

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
}

const PAGE_ID = "zunou";
const ADMIN_EMAILS = new Set([
  "marco@anysigma.com",
  "mgmafo@gmail.com",
  "majin@anysigma.com",
]);
const MAX_BODY_LEN = 4000;

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
  const url = new URL(req.url);
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    const devEmail = url.searchParams.get("dev_email");
    if (devEmail) return devEmail.toLowerCase();
    return "marco@anysigma.com";
  }
  return null;
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

// Find a comment across all anchors. Slow path, used by PATCH/DELETE that don't know the anchor.
const findCommentAnchor = async (
  env: Env,
  id: string
): Promise<{ anchor: string; list: Comment[]; idx: number } | null> => {
  const all = await env.ZUNOU_VOTES.list({ prefix: `comments:${PAGE_ID}:` });
  for (const k of all.keys) {
    const anchorId = k.name.split(":")[2];
    if (!anchorId) continue;
    const list = await readThread(env, anchorId);
    const idx = list.findIndex((c) => c.id === id);
    if (idx !== -1) return { anchor: anchorId, list, idx };
  }
  return null;
};

// ---------------- PATCH ----------------
export const onRequestPatch: PagesFunction<Env, "id"> = async (ctx) => {
  const email = resolveEmail(ctx.request);
  if (!email) return json({ error: "unauthorized" }, 401);

  const id = ctx.params.id as string;
  if (!id || !/^c_[a-z0-9]+$/.test(id))
    return json({ error: "invalid id" }, 400);

  let body: { body?: string; resolved?: boolean };
  try {
    body = (await ctx.request.json()) as typeof body;
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  const found = await findCommentAnchor(ctx.env, id);
  if (!found) return json({ error: "not found" }, 404);

  const { anchor, list, idx } = found;
  const comment = list[idx];
  const isAuthor = comment.author === email;
  const isAdmin = ADMIN_EMAILS.has(email);

  // Edit body
  if (typeof body.body === "string") {
    if (!isAuthor) return json({ error: "forbidden (not author)" }, 403);
    const text = body.body.trim();
    if (!text) return json({ error: "empty body" }, 400);
    if (text.length > MAX_BODY_LEN)
      return json({ error: "body too long" }, 400);
    comment.body = text;
    comment.editedAt = Date.now();
  }

  // Toggle resolved
  if (typeof body.resolved === "boolean") {
    if (!isAuthor && !isAdmin)
      return json({ error: "forbidden (resolve)" }, 403);
    comment.resolved = body.resolved;
  }

  list[idx] = comment;
  await writeThread(ctx.env, anchor, list);
  return json({ ok: true, comment });
};

// ---------------- DELETE ----------------
export const onRequestDelete: PagesFunction<Env, "id"> = async (ctx) => {
  const email = resolveEmail(ctx.request);
  if (!email) return json({ error: "unauthorized" }, 401);

  const id = ctx.params.id as string;
  if (!id || !/^c_[a-z0-9]+$/.test(id))
    return json({ error: "invalid id" }, 400);

  const found = await findCommentAnchor(ctx.env, id);
  if (!found) return json({ error: "not found" }, 404);

  const { anchor, list, idx } = found;
  const comment = list[idx];
  const isAuthor = comment.author === email;
  const isAdmin = ADMIN_EMAILS.has(email);
  if (!isAuthor && !isAdmin)
    return json({ error: "forbidden" }, 403);

  // If deleting a top-level comment, cascade to its replies.
  let remaining: Comment[];
  if (comment.parentId === null) {
    remaining = list.filter(
      (c) => c.id !== comment.id && c.parentId !== comment.id
    );
  } else {
    remaining = list.filter((c) => c.id !== comment.id);
  }
  await writeThread(ctx.env, anchor, remaining);
  return json({ ok: true, deleted: comment.id });
};
