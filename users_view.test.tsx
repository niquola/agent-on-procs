import { test, expect, beforeAll, afterAll } from "bun:test";
import type { Context } from "./ctx.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { queryExists, queryCount, queryTexts } from "./test_html.ts";
import { users_view_list } from "./users_view_list.tsx";
import { users_view_register } from "./users_view_register.tsx";
import type { Users } from "./users.ts";

let ctx: Context;

beforeAll(async () => {
  ctx = await createTestContext();
  await migrations_run(ctx, "./migrations");
});

afterAll(async () => {
  await destroyTestContext(ctx);
});

const makeUser = (name: string, email: string): Users => ({
  id: "u-1",
  name,
  email,
  created_at: new Date(),
});

test("users_view_list renders users", () => {
  const html = users_view_list(ctx, [makeUser("Alice", "alice@test.com"), makeUser("Bob", "bob@test.com")]);
  expect(queryExists(html, '[data-file="users_view_list"]')).toBe(true);
  expect(queryCount(html, '[data-view="user-item"]')).toBe(2);
  expect(queryTexts(html, '[data-role="name"]')).toEqual(["Alice", "Bob"]);
});

test("users_view_list renders empty state", () => {
  const html = users_view_list(ctx, []);
  expect(queryCount(html, '[data-view="user-item"]')).toBe(0);
});

test("users_view_register renders form", () => {
  const html = users_view_register();
  expect(queryExists(html, '[data-file="users_view_register"]')).toBe(true);
  expect(queryExists(html, 'input[name="name"]')).toBe(true);
  expect(queryExists(html, 'input[name="email"]')).toBe(true);
  expect(queryExists(html, 'input[name="password"]')).toBe(true);
  expect(queryExists(html, '[data-action="register"]')).toBe(true);
});

test("users_view_register renders error", () => {
  const html = users_view_register("Email already taken");
  expect(queryExists(html, '[data-role="error"]')).toBe(true);
  expect(queryTexts(html, '[data-role="error"]')).toEqual(["Email already taken"]);
});
