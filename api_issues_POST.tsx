import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { issues_create } from "./issues_create.ts";
import { issues_view_new } from "./issues_view_new.tsx";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function(ctx: Context, session: Session, req: Request) {
  const form = await req.formData();
  const title = (form.get("title") as string)?.trim();
  const body = (form.get("body") as string) ?? "";

  if (!title) {
    return layout_view_page(ctx, session, "New Issue", issues_view_new(ctx, "Title is required"));
  }

  const issue = await issues_create(ctx, session, { title, body });

  return new Response(null, {
    status: 302,
    headers: { Location: `/issues/${issue.id}` },
  });
}
