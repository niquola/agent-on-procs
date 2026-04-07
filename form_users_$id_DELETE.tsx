import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { users_delete } from "./users_delete.ts";
import { auth_isPublic } from "./auth_guard.ts";

export default async function (ctx: Context, session: Session, req: Request, params: { id: string }) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return null;
  }

  const result = await users_delete(ctx, session, params.id);

  if (!result.ok) {
    // Return error in JSON for AJAX requests
    return new Response(JSON.stringify({ error: result.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Redirect to users list
  return new Response(null, {
    status: 302,
    headers: { Location: "/users" },
  });
}
