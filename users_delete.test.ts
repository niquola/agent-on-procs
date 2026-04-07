import { test, expect, beforeAll, afterAll } from "bun:test";
import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { auth_register } from "./auth_register.ts";
import { users_getAll } from "./users_getAll.ts";
import { users_db_list } from "./users_db_list.ts";

let ctx: Context;
let adminSession: Session;
let targetUserSession: Session;

beforeAll(async () => {
  ctx = await createTestContext();
  await migrations_run(ctx, "./migrations");

  const admin = await auth_register(ctx, { name: "Admin", email: "admin@test.com", password: "pass" });
  const target = await auth_register(ctx, { name: "Target User", email: "target@test.com", password: "pass" });

  adminSession = { id: "s1", user: { id: admin.id, name: admin.name, email: admin.email } };
  targetUserSession = { id: "s2", user: { id: target.id, name: target.name, email: target.email } };
});

afterAll(async () => { await destroyTestContext(ctx); });

test("users_delete removes user", async () => {
  const usersBefore = await users_getAll(ctx);
  expect(usersBefore.length).toBe(2);

  const { users_delete } = await import("./users_delete.ts");
  const result = await users_delete(ctx, adminSession, targetUserSession.user.id);

  expect(result.ok).toBe(true);

  const usersAfter = await users_getAll(ctx);
  expect(usersAfter.length).toBe(1);
  expect(usersAfter.some((u: any) => u.email === "target@test.com")).toBe(false);
});

test("users_delete rejects deleting non-existent user", async () => {
  const { users_delete } = await import("./users_delete.ts");
  const result = await users_delete(ctx, adminSession, "nonexistent");

  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.error).toBe("User not found");
});

test("users_delete rejects deleting self", async () => {
  const { users_delete } = await import("./users_delete.ts");
  const result = await users_delete(ctx, adminSession, adminSession.user.id);

  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.error).toBe("Cannot delete your own account");
});

test("form_users_DELETE handles deletion", async () => {
  // Create a new user to delete
  const newUser = await auth_register(ctx, { name: "ToDelete", email: "todelete@test.com", password: "pass" });

  const { users_delete } = await import("./users_delete.ts");
  const result = await users_delete(ctx, adminSession, newUser.id);

  expect(result.ok).toBe(true);

  const usersAfter = await users_getAll(ctx);
  expect(usersAfter.some((u: any) => u.email === "todelete@test.com")).toBe(false);
});
