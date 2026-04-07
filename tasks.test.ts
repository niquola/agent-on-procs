import { test, expect, beforeAll, afterAll } from "bun:test";
import type { Context } from "./ctx.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { tasks_db_create, tasks_db_list, tasks_db_getById, tasks_db_update, tasks_db_delete } from "./tasks.ts";

let ctx: Context;

beforeAll(async () => {
  ctx = await createTestContext();
  await migrations_run(ctx, "./migrations");
});

afterAll(async () => {
  await destroyTestContext(ctx);
});

test("tasks_db_create", async () => {
  const task = await tasks_db_create(ctx, { title: "Test task" });
  expect(task.id).toBeTruthy();
  expect(task.title).toBe("Test task");
  expect(task.status).toBe("todo");
});

test("tasks_db_list", async () => {
  await tasks_db_create(ctx, { title: "List item" });
  const tasks = await tasks_db_list(ctx);
  expect(tasks.length).toBeGreaterThanOrEqual(1);
});

test("tasks_db_getById", async () => {
  const created = await tasks_db_create(ctx, { title: "Find me" });
  const found = await tasks_db_getById(ctx, created.id);
  expect(found).not.toBeNull();
  expect(found!.title).toBe("Find me");
});

test("tasks_db_getById returns null for missing", async () => {
  const found = await tasks_db_getById(ctx, "nonexistent");
  expect(found).toBeNull();
});

test("tasks_db_update", async () => {
  const created = await tasks_db_create(ctx, { title: "Update me" });
  const updated = await tasks_db_update(ctx, created.id, { status: "done" });
  expect(updated!.status).toBe("done");
  expect(updated!.title).toBe("Update me");
});

test("tasks_db_delete", async () => {
  const created = await tasks_db_create(ctx, { title: "Delete me" });
  const deleted = await tasks_db_delete(ctx, created.id);
  expect(deleted).toBe(true);
  const found = await tasks_db_getById(ctx, created.id);
  expect(found).toBeNull();
});
