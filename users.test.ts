import { test, expect, beforeAll, afterAll } from "bun:test";
import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { auth_register } from "./auth_register.ts";
import { issues_create } from "./issues_create.ts";
import { comments_create } from "./comments_create.ts";
import { users_getAll } from "./users_getAll.ts";
import { users_getById } from "./users_getById.ts";
import { users_updateProfile } from "./users_updateProfile.ts";
import { auth_login } from "./auth_login.ts";

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

  const issue = await issues_create(ctx, session1, { title: "Bug", body: "" });
  await comments_create(ctx, session2, issue.id, "On it");
  await comments_create(ctx, session2, issue.id, "Fixed");
});

afterAll(async () => { await destroyTestContext(ctx); });

test("users_getAll returns users with stats", async () => {
  const users = await users_getAll(ctx);
  expect(users.length).toBe(2);
  const alice = users.find(u => u.name === "Alice")!;
  const bob = users.find(u => u.name === "Bob")!;
  expect(alice.issue_count).toBe(1);
  expect(bob.comment_count).toBe(2);
});

test("users_getById returns user with stats", async () => {
  const user = await users_getById(ctx, session1.user.id);
  expect(user).not.toBeNull();
  expect(user!.name).toBe("Alice");
  expect(user!.issue_count).toBe(1);
});

test("users_getById returns null for missing", async () => {
  expect(await users_getById(ctx, "nonexistent")).toBeNull();
});

// --- update profile ---

test("users_updateProfile updates name and email", async () => {
  const res = await users_updateProfile(ctx, session1, { name: "Alice Updated", email: "alice-new@test.com" });
  expect(res.ok).toBe(true);
  const user = await users_getById(ctx, session1.user.id);
  expect(user!.name).toBe("Alice Updated");
  expect(user!.email).toBe("alice-new@test.com");
});

test("users_updateProfile rejects duplicate email", async () => {
  const res = await users_updateProfile(ctx, session1, { name: "Alice", email: "bob@test.com" });
  expect(res.ok).toBe(false);
  if (!res.ok) expect(res.error).toBe("Email already taken");
});

test("users_updateProfile changes password", async () => {
  const res = await users_updateProfile(ctx, session1, { name: "Alice Updated", email: "alice-new@test.com", currentPassword: "pass", newPassword: "newpass" });
  expect(res.ok).toBe(true);
  const login = await auth_login(ctx, "alice-new@test.com", "newpass");
  expect(login).not.toBeNull();
});

test("users_updateProfile rejects wrong current password", async () => {
  const res = await users_updateProfile(ctx, session1, { name: "Alice", email: "alice-new@test.com", currentPassword: "wrong", newPassword: "x" });
  expect(res.ok).toBe(false);
  if (!res.ok) expect(res.error).toBe("Current password is incorrect");
});

test("users_updateProfile requires current password for change", async () => {
  const res = await users_updateProfile(ctx, session1, { name: "Alice", email: "alice-new@test.com", newPassword: "x" });
  expect(res.ok).toBe(false);
  if (!res.ok) expect(res.error).toBe("Current password is required");
});
