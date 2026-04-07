import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { issues_reopen } from "./issues_reopen.ts";

export default async function(ctx: Context, session: Session, req: Request, params: { id: string }) {
  await issues_reopen(ctx, params.id);
  return new Response(null, {
    status: 302,
    headers: { Location: `/issues/${params.id}` },
  });
}
