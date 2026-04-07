import { test, expect, beforeAll, afterAll } from "bun:test";
import type { Context } from "./ctx.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { auth_hashPassword } from "./auth_hashPassword.ts";
import { auth_verifyPassword } from "./auth_verifyPassword.ts";
import { auth_register } from "./auth_register.ts";
import { auth_login } from "./auth_login.ts";
import { session_create } from "./session_create.ts";
import { session_resolve } from "./session_resolve.ts";
import { session_destroy } from "./session_destroy.ts";
import { session_getIdFromRequest } from "./session_getIdFromRequest.ts";
import HTTP_POST_login from "./HTTP_POST_login.tsx";
import HTTP_POST_register from "./HTTP_POST_register.tsx";
import HTTP_POST_logout from "./HTTP_POST_logout.tsx";
import { router_buildRoutes } from "./router_buildRoutes.ts";

let ctx: Context;

beforeAll(async () => {
  ctx = await createTestContext();
  await migrations_run(ctx, "./migrations");
});

afterAll(async () => {
  await destroyTestContext(ctx);
});

// --- password hashing ---

test("auth_hashPassword returns hash different from input", async () => {
  const hash = await auth_hashPassword("secret123");
  expect(hash).toBeTruthy();
  expect(hash).not.toBe("secret123");
});

test("auth_verifyPassword matches correct password", async () => {
  const hash = await auth_hashPassword("secret123");
  expect(await auth_verifyPassword("secret123", hash)).toBe(true);
  expect(await auth_verifyPassword("wrong", hash)).toBe(false);
});

// --- register ---

test("auth_register creates user with hashed password", async () => {
  const user = await auth_register(ctx, { name: "Alice", email: "alice@test.com", password: "pass123" });
  expect(user.id).toBeTruthy();
  expect(user.name).toBe("Alice");
  const [row] = await ctx.db`SELECT password_hash FROM users WHERE id = ${user.id}`;
  expect(row.password_hash).toBeTruthy();
  expect(row.password_hash).not.toBe("pass123");
});

// --- login ---

test("auth_login returns user for correct credentials", async () => {
  await auth_register(ctx, { name: "Bob", email: "bob@test.com", password: "bobpass" });
  const result = await auth_login(ctx, "bob@test.com", "bobpass");
  expect(result).not.toBeNull();
  expect(result!.name).toBe("Bob");
});

test("auth_login returns null for wrong password", async () => {
  const result = await auth_login(ctx, "bob@test.com", "wrong");
  expect(result).toBeNull();
});

test("auth_login returns null for unknown email", async () => {
  const result = await auth_login(ctx, "nobody@test.com", "pass");
  expect(result).toBeNull();
});

// --- sessions ---

test("session lifecycle: create, resolve, destroy", async () => {
  const user = await auth_register(ctx, { name: "Carol", email: "carol@test.com", password: "carolpass" });
  const sessionId = await session_create(ctx, user.id);
  expect(sessionId).toBeTruthy();

  const session = await session_resolve(ctx, sessionId);
  expect(session).not.toBeNull();
  expect(session!.id).toBe(sessionId);
  expect(session!.user.id).toBe(user.id);
  expect(session!.user.name).toBe("Carol");

  await session_destroy(ctx, sessionId);
  expect(await session_resolve(ctx, sessionId)).toBeNull();
});

test("session_resolve returns null for invalid session", async () => {
  expect(await session_resolve(ctx, "nonexistent")).toBeNull();
});

test("session_getIdFromRequest parses sid cookie", () => {
  const req = new Request("http://localhost/", { headers: { cookie: "sid=abc123; other=val" } });
  expect(session_getIdFromRequest(req)).toBe("abc123");
});

test("session_getIdFromRequest returns null without cookie", () => {
  const req = new Request("http://localhost/");
  expect(session_getIdFromRequest(req)).toBeNull();
});

// --- HTTP POST /login ---

test("POST /login redirects and sets cookie on success", async () => {
  await auth_register(ctx, { name: "Eve", email: "eve@test.com", password: "evepass" });
  const form = new FormData();
  form.set("email", "eve@test.com");
  form.set("password", "evepass");
  const req = new Request("http://localhost/login", { method: "POST", body: form });

  const res = await HTTP_POST_login(ctx, null, req);
  expect(res).toBeInstanceOf(Response);
  expect((res as Response).status).toBe(302);
  expect((res as Response).headers.get("Location")).toBe("/issues");
  expect((res as Response).headers.get("Set-Cookie")).toContain("sid=");
});

test("POST /login returns error html for wrong credentials", async () => {
  const form = new FormData();
  form.set("email", "eve@test.com");
  form.set("password", "wrong");
  const req = new Request("http://localhost/login", { method: "POST", body: form });

  const res = await HTTP_POST_login(ctx, null, req);
  expect(typeof res).toBe("string");
  expect(res as string).toContain("Invalid email or password");
});

// --- HTTP POST /register ---

test("POST /register creates user and redirects", async () => {
  const form = new FormData();
  form.set("name", "Frank");
  form.set("email", "frank@test.com");
  form.set("password", "frankpass");
  const req = new Request("http://localhost/register", { method: "POST", body: form });

  const res = await HTTP_POST_register(ctx, null, req);
  expect(res).toBeInstanceOf(Response);
  expect((res as Response).status).toBe(302);
  expect((res as Response).headers.get("Set-Cookie")).toContain("sid=");
});

test("POST /register rejects duplicate email", async () => {
  const form = new FormData();
  form.set("name", "Frank2");
  form.set("email", "frank@test.com");
  form.set("password", "pass");
  const req = new Request("http://localhost/register", { method: "POST", body: form });

  const res = await HTTP_POST_register(ctx, null, req);
  expect(typeof res).toBe("string");
  expect(res as string).toContain("Email already taken");
});

test("POST /register rejects missing fields", async () => {
  const form = new FormData();
  form.set("email", "x@test.com");
  const req = new Request("http://localhost/register", { method: "POST", body: form });

  const res = await HTTP_POST_register(ctx, null, req);
  expect(typeof res).toBe("string");
  expect(res as string).toContain("All fields are required");
});

// --- HTTP POST /logout ---

test("POST /logout clears cookie and redirects", async () => {
  const user = await auth_register(ctx, { name: "Grace", email: "grace@test.com", password: "gracepass" });
  const sessionId = await session_create(ctx, user.id);
  const session = await session_resolve(ctx, sessionId);

  const res = await HTTP_POST_logout(ctx, session, new Request("http://localhost/logout", { method: "POST" }));
  expect(res).toBeInstanceOf(Response);
  expect((res as Response).status).toBe(302);
  expect((res as Response).headers.get("Location")).toBe("/login");
  expect((res as Response).headers.get("Set-Cookie")).toContain("Max-Age=0");

  expect(await session_resolve(ctx, sessionId)).toBeNull();
});

// --- auth guard (interceptor) ---

test("protected route redirects to /login without session", async () => {
  const routes = await router_buildRoutes(".", ctx);
  const handler = routes["/issues"]!["GET"]!;
  const req = new Request("http://localhost/issues");
  const res = await handler(req);
  expect(res.status).toBe(302);
  expect(res.headers.get("Location")).toBe("/login");
});

test("protected route works with valid session", async () => {
  const user = await auth_register(ctx, { name: "Hank", email: "hank@test.com", password: "hankpass" });
  const sessionId = await session_create(ctx, user.id);
  const routes = await router_buildRoutes(".", ctx);
  const handler = routes["/issues"]!["GET"]!;
  const req = new Request("http://localhost/issues", {
    headers: { cookie: `sid=${sessionId}` },
  });
  const res = await handler(req);
  expect(res.status).toBe(200);
  expect(res.headers.get("Content-Type")).toContain("text/html");
});

test("public routes work without session", async () => {
  const routes = await router_buildRoutes(".", ctx);
  const loginHandler = routes["/login"]!["GET"]!;
  const res = await loginHandler(new Request("http://localhost/login"));
  expect(res.status).toBe(200);

  const registerHandler = routes["/register"]!["GET"]!;
  const res2 = await registerHandler(new Request("http://localhost/register"));
  expect(res2.status).toBe(200);
});
