import { test, expect, beforeAll, afterAll } from "bun:test";
import type { Context } from "./ctx.ts";
import type { IssueWithUser } from "./issues_type_IssueWithUser.ts";
import type { CommentWithUser } from "./comments_type_CommentWithUser.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { pageState } from "./cdp_pageState.ts";
import { issues_view_list } from "./issues_view_list.tsx";
import { issues_view_new } from "./issues_view_new.tsx";
import { issues_view_detail } from "./issues_view_detail.tsx";
import { issues_view_page } from "./issues_view_page.tsx";

let ctx: Context;

beforeAll(async () => {
  ctx = await createTestContext();
  await migrations_run(ctx, "./migrations");
});

afterAll(() => destroyTestContext(ctx));

const makeIssue = (id: string, title: string, status = "open", userName = "Alice", commentCount = 0): IssueWithUser => ({
  id,
  title,
  body: "Some body",
  status,
  user_id: "u-1",
  user_name: userName,
  assignee_id: null,
  assignee_name: null,
  comment_count: commentCount,
  created_at: new Date(),
  updated_at: new Date(),
});

const makeComment = (id: string, body: string, userName: string): CommentWithUser => ({
  id,
  issue_id: "i-1",
  user_id: "u-1",
  user_name: userName,
  body,
  created_at: new Date(),
});

// --- issues list page ---

test("issues list page state", () => {
  const html = issues_view_page(ctx, [
    makeIssue("i-1", "Bug report", "open", "Alice", 3),
    makeIssue("i-2", "Feature req", "closed", "Bob"),
  ]);
  const state = pageState(html);
  expect(state.page).toBe("issues-list");
  expect(state.entities).toHaveLength(2);
  expect(state.entities[0]!.type).toBe("issue");
  expect(state.entities[0]!.id).toBe("i-1");
  expect(state.entities[0]!.status).toBe("open");
  expect(state.entities[0]!.fields.title).toBe("Bug report");
  expect(state.entities[0]!.fields.author).toBe("Alice");
  expect(state.entities[1]!.fields.title).toBe("Feature req");
  expect(state.entities[1]!.status).toBe("closed");
  expect(state.nav).toContain("/issues/new");
});

// --- new issue page ---

test("new issue page state", () => {
  const html = issues_view_new(ctx);
  const state = pageState(html);
  expect(state.page).toBe("issue-new");
  expect(state.forms).toHaveLength(1);
  expect(state.forms[0]!.name).toBe("create-issue");
  expect(state.forms[0]!.fields).toContain("title");
  expect(state.forms[0]!.fields).toContain("body");
  expect(state.actions.map((a) => a.action)).toContain("create");
});

// --- issue detail page ---

test("issue detail page state", () => {
  const issue = makeIssue("i-1", "Detail test", "open", "Alice", 2);
  const comments = [
    makeComment("c-1", "First comment", "Alice"),
    makeComment("c-2", "Second comment", "Bob"),
  ];
  const html = issues_view_detail(ctx, issue, comments);
  const state = pageState(html);

  expect(state.page).toBe("issue-detail");

  // main entity
  const main = state.entities.find((e) => e.type === "issue");
  expect(main).toBeTruthy();
  expect(main!.id).toBe("i-1");
  expect(main!.status).toBe("open");
  expect(main!.fields.title).toBe("Detail test");
  expect(main!.fields.author).toBe("Alice");

  // comments
  const commentEntities = state.entities.filter((e) => e.type === "comment");
  expect(commentEntities).toHaveLength(2);
  expect(commentEntities[0]!.fields["comment-body"]).toBe("First comment");
  expect(commentEntities[0]!.fields["comment-author"]).toBe("Alice");

  // actions
  expect(state.actions.map((a) => a.action)).toContain("close");
  expect(state.actions.map((a) => a.action)).toContain("comment");

  // forms
  expect(state.forms.map((f) => f.name)).toContain("add-comment");
  expect(state.forms.map((f) => f.name)).toContain("assign");
});

test("closed issue has reopen action, not close", () => {
  const html = issues_view_detail(ctx, makeIssue("i-1", "Closed", "closed"), []);
  const state = pageState(html);
  const actions = state.actions.map((a) => a.action);
  expect(actions).toContain("reopen");
  expect(actions).not.toContain("close");
});
