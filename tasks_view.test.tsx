import { test, expect, beforeAll, afterAll } from "bun:test";
import type { Context } from "./ctx.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { tasks_db_create } from "./tasks.ts";
import { tasks_view_list, tasks_view_item } from "./tasks_view_list.tsx";
import { tasks_view_form } from "./tasks_view_form.tsx";
import { tasks_view_page } from "./tasks_view_page.tsx";
import { layout_view_page } from "./layout_view_page.tsx";
import { queryExists, queryCount, queryTexts, queryAttrs } from "./test_html.ts";

let ctx: Context;

beforeAll(async () => {
  ctx = await createTestContext();
  await migrations_run(ctx, "./migrations");
});

afterAll(() => destroyTestContext(ctx));

const mockSession = {
  id: "sess-1",
  user: { id: "u-1", name: "Test User", email: "test@test.com" },
};

test("tasks_view_form has input and submit", () => {
  const html = tasks_view_form(ctx);
  expect(queryExists(html, '[data-view="task-form"]')).toBe(true);
  expect(queryExists(html, '[data-role="title-input"]')).toBe(true);
  expect(queryExists(html, '[data-action="add"]')).toBe(true);
  expect(queryAttrs(html, "form", "hx-post")).toEqual(["/tasks"]);
});

test("tasks_view_item todo has done and delete buttons", async () => {
  const task = await tasks_db_create(ctx, { title: "Test item" });
  const html = tasks_view_item(ctx, task);
  expect(queryExists(html, '[data-view="task-item"]')).toBe(true);
  expect(queryAttrs(html, "[data-view]", "data-status")).toEqual(["todo"]);
  expect(queryTexts(html, '[data-role="title"]')).toEqual(["Test item"]);
  expect(queryExists(html, '[data-action="done"]')).toBe(true);
  expect(queryExists(html, '[data-action="delete"]')).toBe(true);
});

test("tasks_view_item done has no done button", async () => {
  const task = await tasks_db_create(ctx, { title: "Done item" });
  task.status = "done";
  const html = tasks_view_item(ctx, task);
  expect(queryAttrs(html, "[data-view]", "data-status")).toEqual(["done"]);
  expect(queryExists(html, '[data-action="done"]')).toBe(false);
  expect(queryExists(html, '[data-action="delete"]')).toBe(true);
});

test("tasks_view_list renders all tasks", async () => {
  const t1 = await tasks_db_create(ctx, { title: "First" });
  const t2 = await tasks_db_create(ctx, { title: "Second" });
  const html = tasks_view_list(ctx, [t1, t2]);
  expect(queryExists(html, '[data-view="tasks-list"]')).toBe(true);
  expect(queryCount(html, '[data-view="task-item"]')).toBe(2);
});

test("tasks_view_page has form and list", async () => {
  const t = await tasks_db_create(ctx, { title: "Page test" });
  const html = tasks_view_page(ctx, [t]);
  expect(queryExists(html, '[data-view="task-form"]')).toBe(true);
  expect(queryExists(html, '[data-view="tasks-list"]')).toBe(true);
});

test("layout has htmx and tailwind", () => {
  const html = layout_view_page(ctx, mockSession, "My Title", "<p>hello</p>");
  expect(queryExists(html, "html")).toBe(true);
  expect(queryTexts(html, "title")).toEqual(["My Title"]);
  expect(queryAttrs(html, 'script[src*="htmx"]', "src").length).toBe(1);
  expect(queryAttrs(html, 'script[src*="tailwind"]', "src").length).toBe(1);
});

test("layout shows user name and logout when session present", () => {
  const html = layout_view_page(ctx, mockSession, "Test", "<p>body</p>");
  expect(queryTexts(html, '[data-role="user-name"]')).toEqual(["Test User"]);
  expect(queryExists(html, '[data-action="logout"]')).toBe(true);
});

test("layout hides nav when no session", () => {
  const html = layout_view_page(ctx, null, "Test", "<p>body</p>");
  expect(queryExists(html, '[data-role="user-name"]')).toBe(false);
  expect(queryExists(html, '[data-action="logout"]')).toBe(false);
});
