import { test, expect, beforeAll, afterAll, beforeEach, describe } from "bun:test";
import type { Context } from "./ctx.ts";
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";
import { auth_register } from "./auth_register.ts";
import { session_create } from "./session_create.ts";
import type { Session } from "./session_type_Session.ts";

let ctx: Context;

beforeAll(async () => {
  ctx = await createTestContext();
  await migrations_run(ctx, "./migrations");
});

afterAll(() => destroyTestContext(ctx));

beforeEach(async () => {
  // Clear all issues before each test
  await ctx.db`DELETE FROM issues`;
});

describe("API /api/issues", () => {
  test("returns JSON list of issues", async () => {
    const mod = await import("./api_issues_GET.tsx");
    const handler = mod.default;

    // Create a test user via auth_register
    const user = await auth_register(ctx, {
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    });

    // Create a test session
    const sessionId = await session_create(ctx, user.id);
    const session: Session = { id: sessionId, user };

    // Create a test issue
    await ctx.db`
      INSERT INTO issues (title, body, status, user_id)
      VALUES (${'Test Issue'}, ${'Test body'}, 'open', ${user.id})
    `;

    // Call handler directly (no HTTP needed)
    const response = await handler(ctx, session, {} as Request);

    expect(response).toBeInstanceOf(Response);
    expect((response as Response).status).toBe(200);

    const contentType = (response as Response).headers.get("content-type");
    expect(contentType).toContain("application/json");

    const data = await (response as Response).json() as any;
    expect(Array.isArray(data)).toBe(true);

    const issue = data.find((i: any) => i.title === "Test Issue");
    expect(issue).toBeDefined();
    expect(issue.body).toBe("Test body");
    expect(issue.status).toBe("open");
  });

  test("returns empty array when no issues exist", async () => {
    const mod = await import("./api_issues_GET.tsx");
    const handler = mod.default;

    // Create a test user via auth_register
    const user = await auth_register(ctx, {
      name: "Empty User",
      email: "empty@example.com",
      password: "password123"
    });

    // Create a test session
    const sessionId = await session_create(ctx, user.id);
    const session: Session = { id: sessionId, user };

    // Call handler directly (no HTTP needed)
    const response = await handler(ctx, session, {} as Request);

    const data = await (response as Response).json() as any;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });
});
