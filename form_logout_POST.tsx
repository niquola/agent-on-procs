import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { session_destroy } from "./session_destroy.ts";

export default async function (ctx: Context, session: Session | null, req: Request) {
  if (session) {
    await session_destroy(ctx, session.id);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/login",
      "Set-Cookie": "sid=; Path=/; HttpOnly; Max-Age=0",
    },
  });
}
