// Helper to get session cookie for testing with curl
// Usage: bun test_session.ts [email]
import { ctx } from "./ctx_start.ts";
import { session_create } from "./session_create.ts";

export async function getTestSessionCookie(email = "niquola@gmail.com") {
  const [user] = await ctx.db`SELECT id FROM users WHERE email = ${email}`;
  if (!user) throw new Error(`User not found: ${email}`);
  const sessionId = await session_create(ctx, user.id);
  return `sid=${sessionId}`;
}

if (import.meta.main) {
  const email = process.argv[2] || "niquola@gmail.com";
  const cookie = await getTestSessionCookie(email);
  console.log(cookie);
}
