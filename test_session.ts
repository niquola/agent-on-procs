// Helper to get session cookie for testing with curl
import { ctx } from "./ctx_start.ts";
import { session_create } from "./session_create.ts";

export async function getTestSessionCookie() {
  // Use the test user we created earlier
  const userId = "019d69b8-1d9f-7000-9d71-4c942b497616"; // Test User
  const sessionId = await session_create(ctx, userId);
  return `sid=${sessionId}`;
}

// If run directly, print the cookie
if (import.meta.main) {
  const cookie = await getTestSessionCookie();
  console.log(cookie);
}
