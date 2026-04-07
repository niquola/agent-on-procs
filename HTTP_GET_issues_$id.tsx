import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { issues_getById } from "./issues_getById.ts";
import { comments_listByIssue } from "./comments_listByIssue.ts";
import { users_db_list } from "./users_db_list.ts";
import { issues_view_detail } from "./issues_view_detail.tsx";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function(ctx: Context, session: Session, req: Request, params: { id: string }) {
  const issue = await issues_getById(ctx, params.id);
  if (!issue) return null;
  const [comments, users] = await Promise.all([
    comments_listByIssue(ctx, issue.id),
    users_db_list(ctx),
  ]);
  return layout_view_page(ctx, session, issue.title, issues_view_detail(ctx, issue, comments, users.map((u) => ({ id: u.id, name: u.name }))));
}
