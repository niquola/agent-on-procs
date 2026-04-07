import { test, expect, beforeAll, afterAll } from "bun:test";
import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { auth_register } from "./auth_register.ts";
import { issues_create } from "./issues_create.ts";
import { issues_listAll } from "./issues_listAll.ts";
import { issues_getById } from "./issues_getById.ts";
import { issues_close } from "./issues_close.ts";
import { issues_reopen } from "./issues_reopen.ts";
import { issues_assign } from "./issues_assign.ts";
import { comments_create } from "./comments_create.ts";
import { comments_listByIssue } from "./comments_listByIssue.ts";

let ctx: Context;
let session1: Session;
let session2: Session;

beforeAll(async () => {
  ctx = await createTestContext();
  await migrations_run(ctx, "./migrations");
  const u1 = await auth_register(ctx, { name: "Alice", email: "alice@test.com", password: "pass" });
  const u2 = await auth_register(ctx, { name: "Bob", email: "bob@test.com", password: "pass" });
  session1 = { id: "s1", user: { id: u1.id, name: u1.name, email: u1.email } };
  session2 = { id: "s2", user: { id: u2.id, name: u2.name, email: u2.email } };
});

afterAll(async () => {
  await destroyTestContext(ctx);
});

// --- issues ---

test("issues_create creates issue with author", async () => {
  const issue = await issues_create(ctx, session1, { title: "Bug report", body: "Something broke" });
  expect(issue.id).toBeTruthy();
  expect(issue.title).toBe("Bug report");
  expect(issue.body).toBe("Something broke");
  expect(issue.status).toBe("open");
  expect(issue.user_id).toBe(session1.user.id);
});

test("issues_listAll returns all issues with author name", async () => {
  await issues_create(ctx, session2, { title: "Bob's issue", body: "" });
  const all = await issues_listAll(ctx);
  expect(all.length).toBeGreaterThanOrEqual(2);
  const bobIssue = all.find((i) => i.title === "Bob's issue");
  expect(bobIssue).toBeTruthy();
  expect(bobIssue!.user_name).toBe("Bob");
});

test("issues_getById returns issue with author and comment count", async () => {
  const created = await issues_create(ctx, session1, { title: "Detail test", body: "Body text" });
  const issue = await issues_getById(ctx, created.id);
  expect(issue).not.toBeNull();
  expect(issue!.title).toBe("Detail test");
  expect(issue!.body).toBe("Body text");
  expect(issue!.user_name).toBe("Alice");
  expect(issue!.comment_count).toBe(0);
});

test("issues_getById returns null for missing", async () => {
  const issue = await issues_getById(ctx, "nonexistent");
  expect(issue).toBeNull();
});

test("issues_close changes status to closed", async () => {
  const issue = await issues_create(ctx, session1, { title: "To close", body: "" });
  const closed = await issues_close(ctx, issue.id);
  expect(closed!.status).toBe("closed");
});

test("issues_reopen changes status to open", async () => {
  const issue = await issues_create(ctx, session1, { title: "To reopen", body: "" });
  await issues_close(ctx, issue.id);
  const reopened = await issues_reopen(ctx, issue.id);
  expect(reopened!.status).toBe("open");
});

// --- assign ---

test("issues_assign sets assignee", async () => {
  const issue = await issues_create(ctx, session1, { title: "Assign me", body: "" });
  const updated = await issues_assign(ctx, issue.id, session2.user.id);
  expect(updated!.assignee_id).toBe(session2.user.id);
});

test("issues_assign to null unassigns", async () => {
  const issue = await issues_create(ctx, session1, { title: "Unassign me", body: "" });
  await issues_assign(ctx, issue.id, session2.user.id);
  const updated = await issues_assign(ctx, issue.id, null);
  expect(updated!.assignee_id).toBeNull();
});

test("issues_getById includes assignee_name", async () => {
  const issue = await issues_create(ctx, session1, { title: "Assigned detail", body: "" });
  await issues_assign(ctx, issue.id, session2.user.id);
  const detail = await issues_getById(ctx, issue.id);
  expect(detail!.assignee_name).toBe("Bob");
});

test("issues_listAll includes assignee_name", async () => {
  const issue = await issues_create(ctx, session1, { title: "Assigned list", body: "" });
  await issues_assign(ctx, issue.id, session2.user.id);
  const all = await issues_listAll(ctx);
  const found = all.find((i) => i.title === "Assigned list");
  expect(found!.assignee_name).toBe("Bob");
});

// --- comments ---

test("comments_create adds comment to issue", async () => {
  const issue = await issues_create(ctx, session1, { title: "Commentable", body: "" });
  const comment = await comments_create(ctx, session2, issue.id, "Looks good!");
  expect(comment.id).toBeTruthy();
  expect(comment.body).toBe("Looks good!");
  expect(comment.user_id).toBe(session2.user.id);
  expect(comment.issue_id).toBe(issue.id);
});

test("comments_listByIssue returns comments with author name", async () => {
  const issue = await issues_create(ctx, session1, { title: "Multi comments", body: "" });
  await comments_create(ctx, session1, issue.id, "First");
  await comments_create(ctx, session2, issue.id, "Second");
  const comments = await comments_listByIssue(ctx, issue.id);
  expect(comments.length).toBe(2);
  expect(comments[0]!.body).toBe("First");
  expect(comments[0]!.user_name).toBe("Alice");
  expect(comments[1]!.body).toBe("Second");
  expect(comments[1]!.user_name).toBe("Bob");
});

test("issues_getById reflects comment count", async () => {
  const issue = await issues_create(ctx, session1, { title: "Count test", body: "" });
  await comments_create(ctx, session1, issue.id, "c1");
  await comments_create(ctx, session2, issue.id, "c2");
  const detail = await issues_getById(ctx, issue.id);
  expect(detail!.comment_count).toBe(2);
});
