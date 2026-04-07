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
  const cols = await codegen_introspect(ctx, "issues");
  expect(cols.length).toBeGreaterThan(0);
  const names = cols.map((c) => c.column_name);
  expect(names).toContain("id");
  expect(names).toContain("title");
  expect(names).toContain("status");
  expect(names).toContain("body");
  expect(names).toContain("created_at");
});

test("codegen_introspect includes column defaults", async () => {
  const cols = await codegen_introspect(ctx, "issues");
  const id = cols.find((c) => c.column_name === "id");
  expect(id?.has_default).toBe(true);
});

test("codegen_introspect reads column comments", async () => {
  await ctx.db.unsafe(`COMMENT ON COLUMN issues.status IS '"open" | "closed"'`);
  const cols = await codegen_introspect(ctx, "issues");
  const status = cols.find((c) => c.column_name === "status");
  expect(status?.comment).toBe('"open" | "closed"');
});

test("codegen_generateType produces valid type", async () => {
  const cols = await codegen_introspect(ctx, "issues");
  const code = codegen_generateType("issues", cols);
  expect(code).toContain("export type Issues");
  expect(code).toContain("id: string");
  expect(code).toContain("title: string");
  expect(code).toContain("created_at: Date");
  expect(code).toContain("_db_");
});

test("codegen_generateType uses comment as type override", async () => {
  await ctx.db.unsafe(`COMMENT ON COLUMN issues.status IS '"open" | "closed"'`);
  const cols = await codegen_introspect(ctx, "issues");
  const code = codegen_generateType("issues", cols);
  expect(code).toContain('"open" | "closed"');
});

test("codegen_generateCrud produces CRUD files", async () => {
  const cols = await codegen_introspect(ctx, "issues");
  const files = codegen_generateCrud("issues", cols);
  const names = Object.keys(files);
  expect(names).toContain("issues_db_create.ts");
  expect(names).toContain("issues_db_list.ts");
  expect(names).toContain("issues_db_getById.ts");
  expect(names).toContain("issues_db_update.ts");
  expect(names).toContain("issues_db_delete.ts");
  expect(names).toContain("issues_db_search.ts");
});

test("codegen_generateCrud create omits default columns", async () => {
  const cols = await codegen_introspect(ctx, "issues");
  const files = codegen_generateCrud("issues", cols);
  const create = files["issues_db_create.ts"];
  expect(create).toContain("IssuesCreate");
});
