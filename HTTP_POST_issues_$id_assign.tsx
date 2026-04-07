import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { issues_assign } from "./issues_assign.ts";

export default async function(ctx: Context, session: Session, req: Request, params: { id: string }) {
  const form = await req.formData();
  const assigneeId = (form.get("assignee_id") as string) || null;
  await issues_assign(ctx, params.id, assigneeId);
  return new Response(null, {
    status: 302,
    headers: { Location: `/issues/${params.id}` },
  });
}
