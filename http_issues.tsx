import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { issues_listAll } from "./issues_listAll.ts";
import { issues_view_page } from "./issues_view_page.tsx";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function(ctx: Context, session: Session, req: Request) {
  const issues = await issues_listAll(ctx);
  return layout_view_page(ctx, session, "Issues", issues_view_page(ctx, issues));
}
