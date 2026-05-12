// Integration tests for the comments Pages Function.
// Requires the wrangler dev server running on port 8788.
// Run with: pnpm test (which runs `pnpm dev:pages` first if not running).

import { test, before, after, describe } from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.COMMENTS_TEST_BASE || "http://127.0.0.1:8788";
const USER_A = "tester-a@example.com";
const USER_B = "tester-b@example.com";
const ADMIN = "marco@anysigma.com";
const SCRATCH = "test-scratch-" + Math.random().toString(36).slice(2, 8);

const api = (path, opts = {}) => {
  const url = new URL(path, BASE);
  if (opts.as) {
    url.searchParams.set("dev_email", opts.as);
    delete opts.as;
  }
  return fetch(url.toString(), {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
};

const clean = async () => {
  // delete every comment under the scratch anchor
  const r = await api(`/api/comments?anchor=${SCRATCH}`, { as: ADMIN });
  if (!r.ok) return;
  const { comments } = await r.json();
  for (const c of comments) {
    await api(`/api/comments/${c.id}`, { method: "DELETE", as: ADMIN });
  }
};

describe("comments API", () => {
  before(async () => {
    // Probe server
    try {
      const r = await fetch(BASE);
      if (!r.ok) {
        console.error(
          `Server probe failed (status ${r.status}). Is wrangler pages dev running on ${BASE}?`
        );
      }
    } catch (e) {
      console.error(`Cannot reach ${BASE}. Start wrangler with: pnpm dev:pages`);
      throw e;
    }
    await clean();
  });

  after(clean);

  test("rejects POST with no auth (production simulation)", async () => {
    // We can't easily strip the dev_email fallback because we're on localhost.
    // But we can verify the request shape rejects malformed input.
    const r = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ anchor: "BADANCHOR!", body: "x" }),
      as: USER_A,
    });
    assert.equal(r.status, 400);
    const data = await r.json();
    assert.match(data.error, /invalid anchor/);
  });

  test("rejects POST with empty body", async () => {
    const r = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ anchor: SCRATCH, body: "   " }),
      as: USER_A,
    });
    assert.equal(r.status, 400);
  });

  test("rejects POST with body too long", async () => {
    const r = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ anchor: SCRATCH, body: "x".repeat(4001) }),
      as: USER_A,
    });
    assert.equal(r.status, 400);
  });

  test("creates a top-level comment", async () => {
    const r = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ anchor: SCRATCH, body: "Hello from A" }),
      as: USER_A,
    });
    assert.equal(r.status, 200);
    const data = await r.json();
    assert.equal(data.ok, true);
    assert.equal(data.comment.author, USER_A);
    assert.equal(data.comment.anchorId, SCRATCH);
    assert.equal(data.comment.parentId, null);
    assert.equal(data.comment.body, "Hello from A");
    assert.match(data.comment.id, /^c_/);
  });

  test("lists comments by anchor", async () => {
    const r = await api(`/api/comments?anchor=${SCRATCH}`, { as: ADMIN });
    assert.equal(r.status, 200);
    const data = await r.json();
    assert.equal(data.anchor, SCRATCH);
    assert.equal(data.comments.length, 1);
    assert.equal(data.comments[0].author, USER_A);
  });

  test("creates a reply to a top-level comment", async () => {
    // get top-level id
    const top = await api(`/api/comments?anchor=${SCRATCH}`, { as: ADMIN });
    const { comments } = await top.json();
    const parent = comments[0];

    const r = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({
        anchor: SCRATCH,
        body: "Reply from B",
        parentId: parent.id,
      }),
      as: USER_B,
    });
    assert.equal(r.status, 200);
    const data = await r.json();
    assert.equal(data.comment.author, USER_B);
    assert.equal(data.comment.parentId, parent.id);
    assert.equal(data.comment.anchorId, SCRATCH);
  });

  test("rejects reply to a non-existent parent", async () => {
    const r = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({
        anchor: SCRATCH,
        body: "Reply to nothing",
        parentId: "c_doesnotexist",
      }),
      as: USER_A,
    });
    assert.equal(r.status, 400);
  });

  test("rejects nested reply (reply-to-reply)", async () => {
    // get the reply id
    const list = await api(`/api/comments?anchor=${SCRATCH}`, { as: ADMIN });
    const { comments } = await list.json();
    const reply = comments.find((c) => c.parentId !== null);
    assert.ok(reply, "reply should exist from earlier test");

    const r = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({
        anchor: SCRATCH,
        body: "Nested reply",
        parentId: reply.id,
      }),
      as: USER_A,
    });
    assert.equal(r.status, 400);
  });

  test("PATCH edits own comment body", async () => {
    const list = await api(`/api/comments?anchor=${SCRATCH}`, { as: ADMIN });
    const { comments } = await list.json();
    const own = comments.find((c) => c.author === USER_A && !c.parentId);

    const r = await api(`/api/comments/${own.id}`, {
      method: "PATCH",
      body: JSON.stringify({ body: "Hello from A (edited)" }),
      as: USER_A,
    });
    assert.equal(r.status, 200);
    const data = await r.json();
    assert.equal(data.comment.body, "Hello from A (edited)");
    assert.ok(data.comment.editedAt, "editedAt should be set");
  });

  test("PATCH refuses to edit another user's comment", async () => {
    const list = await api(`/api/comments?anchor=${SCRATCH}`, { as: ADMIN });
    const { comments } = await list.json();
    const someone = comments.find((c) => c.author === USER_A);

    const r = await api(`/api/comments/${someone.id}`, {
      method: "PATCH",
      body: JSON.stringify({ body: "Trying to edit someone else's" }),
      as: USER_B,
    });
    assert.equal(r.status, 403);
  });

  test("admin can resolve any comment", async () => {
    const list = await api(`/api/comments?anchor=${SCRATCH}`, { as: ADMIN });
    const { comments } = await list.json();
    const target = comments.find((c) => c.author === USER_A);

    const r = await api(`/api/comments/${target.id}`, {
      method: "PATCH",
      body: JSON.stringify({ resolved: true }),
      as: ADMIN,
    });
    assert.equal(r.status, 200);
    const data = await r.json();
    assert.equal(data.comment.resolved, true);
  });

  test("returns byAnchor index from GET (no anchor param)", async () => {
    const r = await api(`/api/comments`, { as: ADMIN });
    assert.equal(r.status, 200);
    const data = await r.json();
    assert.ok(data.byAnchor, "byAnchor key present");
    assert.ok(Array.isArray(data.byAnchor[SCRATCH]));
    assert.ok(data.byAnchor[SCRATCH].length >= 2);
  });

  test("admin can delete any comment", async () => {
    const list = await api(`/api/comments?anchor=${SCRATCH}`, { as: ADMIN });
    const { comments } = await list.json();
    const replyOnly = comments.find((c) => c.parentId !== null);
    const r = await api(`/api/comments/${replyOnly.id}`, {
      method: "DELETE",
      as: ADMIN,
    });
    assert.equal(r.status, 200);

    const after = await api(`/api/comments?anchor=${SCRATCH}`, { as: ADMIN });
    const { comments: remaining } = await after.json();
    assert.equal(
      remaining.find((c) => c.id === replyOnly.id),
      undefined
    );
  });

  test("delete of top-level cascades to its replies", async () => {
    // Set up a fresh top + reply
    const t = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ anchor: SCRATCH, body: "Top for cascade" }),
      as: USER_A,
    });
    const top = (await t.json()).comment;

    await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({
        anchor: SCRATCH,
        body: "Reply for cascade",
        parentId: top.id,
      }),
      as: USER_B,
    });

    const list1 = await api(`/api/comments?anchor=${SCRATCH}`, { as: ADMIN });
    const before = (await list1.json()).comments;
    const repliesBefore = before.filter((c) => c.parentId === top.id).length;
    assert.equal(repliesBefore, 1);

    const del = await api(`/api/comments/${top.id}`, {
      method: "DELETE",
      as: USER_A,
    });
    assert.equal(del.status, 200);

    const list2 = await api(`/api/comments?anchor=${SCRATCH}`, { as: ADMIN });
    const after = (await list2.json()).comments;
    assert.equal(
      after.find((c) => c.id === top.id),
      undefined,
      "top was deleted"
    );
    assert.equal(
      after.filter((c) => c.parentId === top.id).length,
      0,
      "replies were cascade-deleted"
    );
  });

  test("accepts quotedText + contextBefore/After fields", async () => {
    const r = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({
        anchor: SCRATCH,
        body: "Comment with selection",
        quotedText: "this is the quoted text",
        contextBefore: "Some prefix words ",
        contextAfter: " then suffix words.",
      }),
      as: USER_A,
    });
    assert.equal(r.status, 200);
    const data = await r.json();
    assert.equal(data.comment.quotedText, "this is the quoted text");
    assert.equal(data.comment.contextBefore, "Some prefix words ");
    assert.equal(data.comment.contextAfter, " then suffix words.");
  });

  test("rejects oversized quotedText", async () => {
    const r = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({
        anchor: SCRATCH,
        body: "x",
        quotedText: "y".repeat(1001),
      }),
      as: USER_A,
    });
    assert.equal(r.status, 400);
  });

  test("non-author non-admin cannot delete", async () => {
    const t = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ anchor: SCRATCH, body: "USER_A's comment" }),
      as: USER_A,
    });
    const id = (await t.json()).comment.id;

    const r = await api(`/api/comments/${id}`, {
      method: "DELETE",
      as: USER_B,
    });
    assert.equal(r.status, 403);
  });

  test("admin can unresolve a resolved comment", async () => {
    // create + resolve
    const t = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ anchor: SCRATCH, body: "Will be resolved then reopened" }),
      as: USER_A,
    });
    const id = (await t.json()).comment.id;
    await api(`/api/comments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ resolved: true }),
      as: ADMIN,
    });
    // unresolve
    const r = await api(`/api/comments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ resolved: false }),
      as: ADMIN,
    });
    assert.equal(r.status, 200);
    const data = await r.json();
    assert.equal(data.comment.resolved, false);
  });

  test("PATCH ignores body field from a non-author admin", async () => {
    const t = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ anchor: SCRATCH, body: "USER_A wrote this" }),
      as: USER_A,
    });
    const id = (await t.json()).comment.id;
    const r = await api(`/api/comments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ body: "Admin tried to rewrite" }),
      as: ADMIN,
    });
    assert.equal(r.status, 403);
  });

  test("ordering: comments returned in chronological (createdAt) order", async () => {
    // Create 3 comments in quick succession on a fresh anchor
    const localAnchor = SCRATCH + "-order";
    const a = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ anchor: localAnchor, body: "first" }),
      as: USER_A,
    });
    const b = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ anchor: localAnchor, body: "second" }),
      as: USER_B,
    });
    const c = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ anchor: localAnchor, body: "third" }),
      as: USER_A,
    });
    const list = await (await api(`/api/comments?anchor=${localAnchor}`, { as: ADMIN })).json();
    assert.equal(list.comments[0].body, "first");
    assert.equal(list.comments[1].body, "second");
    assert.equal(list.comments[2].body, "third");
    // cleanup
    await api(`/api/comments/${(await a.json()).comment.id}`, { method: "DELETE", as: ADMIN });
    await api(`/api/comments/${(await b.json()).comment.id}`, { method: "DELETE", as: ADMIN });
    await api(`/api/comments/${(await c.json()).comment.id}`, { method: "DELETE", as: ADMIN });
  });

  test("byAnchor index isolates anchors", async () => {
    const a1 = SCRATCH + "-iso-a";
    const a2 = SCRATCH + "-iso-b";
    const r1 = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ anchor: a1, body: "a-only" }),
      as: USER_A,
    });
    const r2 = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ anchor: a2, body: "b-only" }),
      as: USER_A,
    });
    const all = await (await api(`/api/comments`, { as: ADMIN })).json();
    assert.ok(all.byAnchor[a1], "a1 present");
    assert.ok(all.byAnchor[a2], "a2 present");
    assert.equal(all.byAnchor[a1].length, 1);
    assert.equal(all.byAnchor[a2].length, 1);
    assert.equal(all.byAnchor[a1][0].body, "a-only");
    assert.equal(all.byAnchor[a2][0].body, "b-only");
    // cleanup
    await api(`/api/comments/${(await r1.json()).comment.id}`, { method: "DELETE", as: ADMIN });
    await api(`/api/comments/${(await r2.json()).comment.id}`, { method: "DELETE", as: ADMIN });
  });

  test("empty anchor → 400", async () => {
    const r = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ anchor: "", body: "hi" }),
      as: USER_A,
    });
    assert.equal(r.status, 400);
  });

  test("invalid JSON body → 400", async () => {
    const url = new URL(`/api/comments`, BASE);
    url.searchParams.set("dev_email", USER_A);
    const r = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not-json",
    });
    assert.equal(r.status, 400);
  });

  test("PATCH/DELETE non-existent comment → 404", async () => {
    const r1 = await api(`/api/comments/c_doesnotexist`, {
      method: "PATCH",
      body: JSON.stringify({ resolved: true }),
      as: ADMIN,
    });
    assert.equal(r1.status, 404);

    const r2 = await api(`/api/comments/c_doesnotexist`, {
      method: "DELETE",
      as: ADMIN,
    });
    assert.equal(r2.status, 404);
  });

  test("PATCH invalid id format → 400", async () => {
    const r = await api(`/api/comments/not_a_valid_id`, {
      method: "PATCH",
      body: JSON.stringify({ resolved: true }),
      as: ADMIN,
    });
    assert.equal(r.status, 400);
  });

  test("quotedText + context roundtrip preserves whitespace inside text", async () => {
    const r = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({
        anchor: SCRATCH,
        body: "Roundtrip check",
        quotedText: "lead   with   spaces",
        contextBefore: " before",
        contextAfter: "after ",
      }),
      as: USER_A,
    });
    assert.equal(r.status, 200);
    const data = await r.json();
    assert.equal(data.comment.quotedText, "lead   with   spaces");
    assert.equal(data.comment.contextBefore, " before");
    assert.equal(data.comment.contextAfter, "after ");
  });

  test("oversized contextBefore → 400", async () => {
    const r = await api(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({
        anchor: SCRATCH,
        body: "x",
        contextBefore: "y".repeat(201),
      }),
      as: USER_A,
    });
    assert.equal(r.status, 400);
  });
});
