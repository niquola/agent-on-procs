import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { session_getIdFromRequest } from "./session_getIdFromRequest.ts";
import { session_resolve } from "./session_resolve.ts";

const PUBLIC_PATHS = new Set(["/", "/login", "/register"]);

export function auth_isPublic(path: string): boolean {
  return PUBLIC_PATHS.has(path);
}

export async function auth_guard(ctx: Context, req: Request): Promise<Session | Response | null> {
  const sessionId = session_getIdFromRequest(req);
  const session = sessionId ? await session_resolve(ctx, sessionId) : null;
  const path = new URL(req.url).pathname;

  if (!auth_isPublic(path) && !session) {
    // API routes get 401 JSON, pages get 302 redirect
    if (path.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  return session;
}
