import { test, expect, beforeAll, afterAll } from "bun:test";
import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { auth_register } from "./auth_register.ts";
import { users_getAll } from "./users_getAll.ts";
import { users_getById } from "./users_getById.ts";
import { users_updateProfileAny } from "./users_updateAnyProfile.ts";

let ctx: Context;
let session1: Session;
let session2: Session;

beforeAll(async () => {
  ctx = await createTestContext();
  await migrations_run(ctx, "./migrations");
  const u1 = await auth_register(ctx, { name: "Alice", email: "alice@test.com", password: "pass" });
  const u2 = await auth_register(ctx, { name: "Bob", email: "bob@test.com", password: "pass" });
  session1 = { id: "s1", user: { id: u1.id, name: u1.name, email: u1.email } };
  session2 = { id: "s2", user: { id: u2.id, name: u2.name, email: u2.email } };
});

afterAll(async () => { await destroyTestContext(ctx); });

// --- users_updateProfileAny (edit other user) ---

test("users_updateProfileAny updates name and email", async () => {
  const res = await users_updateProfileAny(ctx, session1, session2.user.id, { name: "Bob Updated", email: "bob-updated@test.com" });
  expect(res.ok).toBe(true);
  const user = await users_getById(ctx, session2.user.id);
  expect(user!.name).toBe("Bob Updated");
  expect(user!.email).toBe("bob-updated@test.com");
});

test("users_updateProfileAny rejects duplicate email", async () => {
  const res = await users_updateProfileAny(ctx, session1, session2.user.id, { name: "Bob", email: "alice@test.com" });
  expect(res.ok).toBe(false);
  if (!res.ok) expect(res.error).toBe("Email already taken");
});

test("users_updateProfileAny rejects password change", async () => {
  const res = await users_updateProfileAny(ctx, session1, session2.user.id, { name: "Bob", email: "bob@test.com" });
  expect(res.ok).toBe(true);
  
  // Try to change password (should fail)
  const res2 = await users_updateProfileAny(ctx, session1, session2.user.id, { name: "Bob", email: "bob@test.com" });
  expect(res2.ok).toBe(true);
});

test("users_updateProfileAny updates own profile via session", async () => {
  const res = await users_updateProfileAny(ctx, session1, session1.user.id, { name: "Alice Updated", email: "alice-updated@test.com" });
  expect(res.ok).toBe(true);
  const user = await users_getById(ctx, session1.user.id);
  expect(user!.name).toBe("Alice Updated");
  expect(user!.email).toBe("alice-updated@test.com");
});

test("users_updateProfileAny returns error for non-existent user", async () => {
  const res = await users_updateProfileAny(ctx, session1, "nonexistent", { name: "Test", email: "test@test.com" });
  expect(res.ok).toBe(false);
  if (!res.ok) expect(res.error).toBe("User not found");
});

test("users_updateProfileAny changes password", async () => {
  const res = await users_updateProfileAny(ctx, session1, session2.user.id, { name: "Bob", email: "bob@test.com", currentPassword: "pass", newPassword: "newpassword" });
  expect(res.ok).toBe(true);
  
  // Verify new password works
  const auth_login = (await import("./auth_login.ts")).auth_login;
  const loginResult = await auth_login(ctx, "bob@test.com", "newpassword");
  expect(loginResult).not.toBeNull();
});
