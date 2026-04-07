import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { users_db_list } from "./users.ts";
import { users_view_page } from "./users_view_page.tsx";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function (ctx: Context, session: Session, req: Request) {
  const users = await users_db_list(ctx);
  return layout_view_page(ctx, session, "Users", users_view_page(ctx, users));
}
