import { test, expect, beforeAll, afterAll } from "bun:test";
import type { Context } from "./ctx.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { codegen_introspect } from "./codegen_introspect.ts";
import { codegen_generateType } from "./codegen_generateType.ts";
import { codegen_generateCrud } from "./codegen_generateCrud.ts";

let ctx: Context;

beforeAll(async () => {
  ctx = await createTestContext();
  await migrations_run(ctx, "./migrations");
});

afterAll(() => destroyTestContext(ctx));

test("codegen_introspect reads table columns", async () => {
  const cols = await codegen_introspect(ctx, "tasks");
  expect(cols.length).toBeGreaterThan(0);
  const names = cols.map((c) => c.column_name);
  expect(names).toContain("id");
  expect(names).toContain("title");
  expect(names).toContain("status");
  expect(names).toContain("created_at");
});

test("codegen_introspect includes column defaults", async () => {
  const cols = await codegen_introspect(ctx, "tasks");
  const id = cols.find((c) => c.column_name === "id");
  expect(id?.has_default).toBe(true);
});

test("codegen_introspect reads column comments", async () => {
  await ctx.db.unsafe(`COMMENT ON COLUMN tasks.status IS '"todo" | "in_progress" | "done"'`);
  const cols = await codegen_introspect(ctx, "tasks");
  const status = cols.find((c) => c.column_name === "status");
  expect(status?.comment).toBe('"todo" | "in_progress" | "done"');
});

test("codegen_generateType produces valid type", async () => {
  const cols = await codegen_introspect(ctx, "tasks");
  const code = codegen_generateType("tasks", cols);
  expect(code).toContain("export type Tasks");
  expect(code).toContain("id: string");
  expect(code).toContain("title: string");
  expect(code).toContain("created_at: Date");
  expect(code).toContain("_db_");
});

test("codegen_generateType uses comment as type override", async () => {
  await ctx.db.unsafe(`COMMENT ON COLUMN tasks.status IS '"todo" | "in_progress" | "done"'`);
  const cols = await codegen_introspect(ctx, "tasks");
  const code = codegen_generateType("tasks", cols);
  expect(code).toContain('"todo" | "in_progress" | "done"');
});

test("codegen_generateCrud produces CRUD files", async () => {
  const cols = await codegen_introspect(ctx, "tasks");
  const files = codegen_generateCrud("tasks", cols);
  const names = Object.keys(files);
  expect(names).toContain("tasks_db_create.gen.ts");
  expect(names).toContain("tasks_db_list.gen.ts");
  expect(names).toContain("tasks_db_getById.gen.ts");
  expect(names).toContain("tasks_db_update.gen.ts");
  expect(names).toContain("tasks_db_delete.gen.ts");
  expect(names).toContain("tasks_db_search.gen.ts");
});

test("codegen_generateCrud create omits default columns", async () => {
  const cols = await codegen_introspect(ctx, "tasks");
  const files = codegen_generateCrud("tasks", cols);
  const create = files["tasks_db_create.gen.ts"];
  expect(create).toContain("TasksCreate");
  expect(create).not.toContain("id?: string"); // id has default, should be optional or omitted
});
