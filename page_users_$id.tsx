import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { users_getById } from "./users_getById.ts";
import { issues_listAll } from "./issues_listAll.ts";
import { users_view_profile } from "./users_view_profile.tsx";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function (ctx: Context, session: Session, req: Request, params: { id: string }) {
  const user = await users_getById(ctx, params.id);
  if (!user) return null;
  const allIssues = await issues_listAll(ctx);
  const userIssues = allIssues.filter(i => i.user_id === user.id);
  return layout_view_page(ctx, session, user.name, users_view_profile(ctx, user, userIssues));
}
