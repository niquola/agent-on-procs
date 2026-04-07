import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { issues_listAll } from "./issues_listAll";

export default async function(ctx: Context, session: Session | null, req: Request) {
  const issues = await issues_listAll(ctx);
  return new Response(JSON.stringify(issues), {
    headers: { "Content-Type": "application/json" },
  });
}
