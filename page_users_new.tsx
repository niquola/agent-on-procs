import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { users_view_new } from "./users_view_new.tsx";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function (ctx: Context, session: Session, req: Request) {
  return layout_view_page(ctx, session, "Add User", users_view_new(ctx, session));
}
