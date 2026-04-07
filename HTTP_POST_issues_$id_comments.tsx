import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { comments_create } from "./comments_create.ts";

export default async function(ctx: Context, session: Session, req: Request, params: { id: string }) {
  const form = await req.formData();
  const body = (form.get("body") as string)?.trim();

  if (!body) {
    return new Response(null, {
      status: 302,
      headers: { Location: `/issues/${params.id}` },
    });
  }

  await comments_create(ctx, session, params.id, body);

  return new Response(null, {
    status: 302,
    headers: { Location: `/issues/${params.id}` },
  });
}
