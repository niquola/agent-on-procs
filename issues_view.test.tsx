import { test, expect, beforeAll, afterAll } from "bun:test";
import type { Context } from "./ctx.ts";
import type { IssueWithUser } from "./issues_type_IssueWithUser.ts";
import type { CommentWithUser } from "./comments_type_CommentWithUser.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { queryExists, queryCount, queryTexts, queryAttrs } from "./test_html.ts";
import { issues_view_list, issues_view_item } from "./issues_view_list.tsx";
import { issues_view_new } from "./issues_view_new.tsx";
import { issues_view_detail } from "./issues_view_detail.tsx";

let ctx: Context;

beforeAll(async () => {
  ctx = await createTestContext();
  await migrations_run(ctx, "./migrations");
});

afterAll(() => destroyTestContext(ctx));

const makeIssue = (title: string, status = "open", userName = "Alice", commentCount = 0): IssueWithUser => ({
  id: "i-1",
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

const makeComment = (body: string, userName: string): CommentWithUser => ({
  id: "c-1",
  issue_id: "i-1",
  user_id: "u-1",
  user_name: userName,
  body,
  created_at: new Date(),
});

test("issues_view_list renders issues with author and status", () => {
  const html = issues_view_list(ctx, [makeIssue("Bug", "open", "Alice", 3), makeIssue("Feature", "closed", "Bob")]);
  expect(queryExists(html, '[data-file="issues_view_list"]')).toBe(true);
  expect(queryCount(html, '[data-view="issue-item"]')).toBe(2);
  expect(queryTexts(html, '[data-role="title"]')).toEqual(["Bug", "Feature"]);
  expect(queryTexts(html, '[data-role="author"]')).toEqual(["Alice", "Bob"]);
});

test("issues_view_item shows comment count", () => {
  const html = issues_view_item(ctx, makeIssue("With comments", "open", "Alice", 5));
  expect(queryTexts(html, '[data-role="comment-count"]')).toEqual(["5"]);
});

test("issues_view_new renders form", () => {
  const html = issues_view_new(ctx);
  expect(queryExists(html, '[data-file="issues_view_new"]')).toBe(true);
  expect(queryExists(html, 'input[name="title"]')).toBe(true);
  expect(queryExists(html, 'textarea[name="body"]')).toBe(true);
  expect(queryExists(html, '[data-action="create"]')).toBe(true);
});

test("issues_view_detail renders issue with comments", () => {
  const issue = makeIssue("Detail test", "open", "Alice", 2);
  const comments = [makeComment("First", "Alice"), makeComment("Second", "Bob")];
  const html = issues_view_detail(ctx, issue, comments);
  expect(queryExists(html, '[data-file="issues_view_detail"]')).toBe(true);
  expect(queryTexts(html, '[data-role="title"]')).toEqual(["Detail test"]);
  expect(queryTexts(html, '[data-role="author"]')).toEqual(["Alice"]);
  expect(queryCount(html, '[data-view="comment"]')).toBe(2);
  expect(queryExists(html, 'textarea[name="body"]')).toBe(true);
});

test("issues_view_detail shows close button for open issue", () => {
  const html = issues_view_detail(ctx, makeIssue("Open", "open"), []);
  expect(queryExists(html, '[data-action="close"]')).toBe(true);
  expect(queryExists(html, '[data-action="reopen"]')).toBe(false);
});

test("issues_view_detail shows reopen button for closed issue", () => {
  const html = issues_view_detail(ctx, makeIssue("Closed", "closed"), []);
  expect(queryExists(html, '[data-action="reopen"]')).toBe(true);
  expect(queryExists(html, '[data-action="close"]')).toBe(false);
});
