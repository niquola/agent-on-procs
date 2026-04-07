import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { users_view_edit } from "./users_view_edit.tsx";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function (ctx: Context, session: Session, req: Request) {
  return layout_view_page(ctx, session, "Edit Profile", users_view_edit(ctx, session));
}
