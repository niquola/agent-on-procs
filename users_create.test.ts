import { test, expect, beforeAll, afterAll } from "bun:test";
import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { users_db_list } from "./users_db_list.ts";

let ctx: Context;
let session: Session;

beforeAll(async () => {
  ctx = await createTestContext();
  await migrations_run(ctx, "./migrations");
  
  // Create a session user
  const [user] = await ctx.db`INSERT INTO users (id, name, email) VALUES (${crypto.randomUUID()}, ${'Admin'}, ${'admin@test.com'}) RETURNING *`;
  session = { id: "s1", user: { id: user.id, name: user.name, email: user.email } };
});

afterAll(async () => { await destroyTestContext(ctx); });

// --- form_users_POST (create new user) ---

test("form_users_POST creates new user", async () => {
  const form = new FormData();
  form.set("name", "New User");
  form.set("email", "newuser@test.com");
  form.set("password", "testpass123");

  const req = new Request("http://localhost/users", {
    method: "POST",
    body: form,
  });

  const { default: handler } = await import("./form_users_POST.tsx");
  const result = await handler(ctx, session, req);

  expect(result).not.toBeNull();

  // Verify user was created
  const users = await users_db_list(ctx);
  const newUser = users.find((u) => u.email === "newuser@test.com");
  expect(newUser).toBeDefined();
  if (newUser) {
    expect(newUser.name).toBe("New User");
  }
});

test("form_users_POST rejects duplicate email", async () => {
  // First create a user
  const form1 = new FormData();
  form1.set("name", "Duplicate User");
  form1.set("email", "dup@test.com");
  form1.set("password", "testpass");

  const req1 = new Request("http://localhost/users", {
    method: "POST",
    body: form1,
  });

  const { default: handler } = await import("./form_users_POST.tsx");
  await handler(ctx, session, req1);

  // Try to create another user with same email
  const form2 = new FormData();
  form2.set("name", "Duplicate User 2");
  form2.set("email", "dup@test.com");
  form2.set("password", "testpass");

  const req2 = new Request("http://localhost/users", {
    method: "POST",
    body: form2,
  });

  const result = await handler(ctx, session, req2);
  expect(result).not.toBeNull();

  // Verify only one user exists
  const users = await users_db_list(ctx);
  const dupUsers = users.filter((u) => u.email === "dup@test.com");
  expect(dupUsers.length).toBe(1);
});

test("form_users_POST rejects missing fields", async () => {
  // Missing name
  const form1 = new FormData();
  form1.set("email", "missing@test.com");
  form1.set("password", "testpass");

  const req1 = new Request("http://localhost/users", {
    method: "POST",
    body: form1,
  });

  const { default: handler } = await import("./form_users_POST.tsx");
  const result1 = await handler(ctx, session, req1);
  expect(result1).not.toBeNull();

  // Verify no user was created
  let users = await users_db_list(ctx);
  expect(users.some((u) => u.email === "missing@test.com")).toBe(false);

  // Missing email
  const form2 = new FormData();
  form2.set("name", "Missing Email");
  form2.set("password", "testpass");

  const req2 = new Request("http://localhost/users", {
    method: "POST",
    body: form2,
  });

  const result2 = await handler(ctx, session, req2);
  expect(result2).not.toBeNull();

  // Verify no user was created
  users = await users_db_list(ctx);
  expect(users.some((u) => u.name === "Missing Email")).toBe(false);
});
