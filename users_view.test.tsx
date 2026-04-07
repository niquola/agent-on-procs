import { test, expect, beforeAll, afterAll } from "bun:test";
import type { Context } from "./ctx.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { pageState } from "./cdp_pageState.ts";
import { queryExists, queryTexts } from "./test_html.ts";
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

test("users_view_list renders users as entities", () => {
  const html = users_view_list(ctx, [makeUser("Alice", "alice@test.com"), makeUser("Bob", "bob@test.com")]);
  const state = pageState(html);
  expect(state.entities).toHaveLength(2);
  expect(state.entities[0]!.type).toBe("user");
  expect(state.entities[0]!.fields.name).toBe("Alice");
  expect(state.entities[1]!.fields.name).toBe("Bob");
});

test("users_view_list renders empty", () => {
  const html = users_view_list(ctx, []);
  const state = pageState(html);
  expect(state.entities).toHaveLength(0);
});

test("users_view_register page state", () => {
  const html = users_view_register();
  const state = pageState(html);
  expect(state.page).toBe("register");
  expect(state.forms[0]!.name).toBe("register");
  expect(state.forms[0]!.fields.map((f) => f.name)).toEqual(["name", "email", "password"]);
  expect(state.actions.map((a) => a.action)).toContain("register");
});

test("users_view_register renders error", () => {
  const html = users_view_register("Email already taken");
  expect(queryExists(html, '[data-role="error"]')).toBe(true);
  expect(queryTexts(html, '[data-role="error"]')).toEqual(["Email already taken"]);
});
