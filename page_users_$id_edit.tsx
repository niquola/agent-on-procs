import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { users_getById } from "./users_getById.ts";
import { users_view_edit } from "./users_view_edit.tsx";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function (ctx: Context, session: Session, req: Request, params: { id: string }) {
  const user = await users_getById(ctx, params.id);
  if (!user) return null;
  
  // Allow editing own profile only
  if (session.user.id !== user.id) {
    return layout_view_page(ctx, session, "Error", <div>Only admin users can edit other profiles</div>);
  }
  
  return layout_view_page(ctx, session, "Edit User", users_view_edit(ctx, session));
}
