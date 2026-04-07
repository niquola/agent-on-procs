import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { issues_close } from "./issues_close.ts";

export default async function(ctx: Context, session: Session, req: Request, params: { id: string }) {
  await issues_close(ctx, params.id);
  return new Response(null, {
    status: 302,
    headers: { Location: `/issues/${params.id}` },
  });
}
