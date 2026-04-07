import { test, expect, beforeAll, afterAll } from "bun:test";
import type { Context } from "./ctx.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { pageState } from "./cdp_pageState.ts";
import { queryExists, queryTexts } from "./test_html.ts";
import { users_view_list } from "./users_view_list.tsx";
import { users_view_page } from "./users_view_page.tsx";
import { users_view_profile } from "./users_view_profile.tsx";
import { users_view_register } from "./users_view_register.tsx";
import type { UserWithStats } from "./users_getAll.ts";

let ctx: Context;

beforeAll(async () => {
  ctx = await createTestContext();
  await migrations_run(ctx, "./migrations");
});

afterAll(async () => { await destroyTestContext(ctx); });

const makeUser = (id: string, name: string, email: string, issues = 0, comments = 0): UserWithStats => ({
  id, name, email, created_at: new Date(), issue_count: issues, comment_count: comments,
});

test("users list page state", () => {
  const html = users_view_page(ctx, [
    makeUser("u-1", "Alice", "alice@test.com", 3, 10),
    makeUser("u-2", "Bob", "bob@test.com", 1, 5),
  ]);
  const state = pageState(html);
  expect(state.page).toBe("users-list");
  expect(state.entities).toHaveLength(2);
  expect(state.entities[0]!.type).toBe("user");
  expect(state.entities[0]!.fields.name).toBe("Alice");
  expect(state.entities[0]!.fields.email).toBe("alice@test.com");
  expect(state.entities[0]!.fields["issue-count"]).toBe("3 issues");
  expect(state.entities[0]!.href).toBe("/users/u-1");
});

test("users profile page state", () => {
  const user = makeUser("u-1", "Alice", "alice@test.com", 2, 7);
  const html = users_view_profile(ctx, user, []);
  const state = pageState(html);
  expect(state.page).toBe("user-profile");
  const entity = state.entities.find(e => e.type === "user");
  expect(entity!.id).toBe("u-1");
  expect(entity!.fields.name).toBe("Alice");
  expect(entity!.fields["issue-count"]).toBe("2");
});

test("register page state", () => {
  const html = users_view_register();
  const state = pageState(html);
  expect(state.page).toBe("register");
  expect(state.forms[0]!.name).toBe("register");
  expect(state.forms[0]!.fields.map(f => f.name)).toEqual(["name", "email", "password"]);
});

test("register renders error", () => {
  const html = users_view_register("Email taken");
  expect(queryExists(html, '[data-role="error"]')).toBe(true);
  expect(queryTexts(html, '[data-role="error"]')).toEqual(["Email taken"]);
});
