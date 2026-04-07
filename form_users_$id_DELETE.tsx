import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { users_delete } from "./users_delete.ts";

export default async function (ctx: Context, session: Session, req: Request, params: { id: string }) {
  const result = await users_delete(ctx, session, params.id);

  if (!result.ok) {
    return new Response(null, { status: 302, headers: { Location: "/users" } });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: "/users" },
  });
}
