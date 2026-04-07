import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { users_getAll } from "./users_getAll.ts";
import { users_view_page } from "./users_view_page.tsx";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function (ctx: Context, session: Session, req: Request) {
  const users = await users_getAll(ctx);
  console.log('[page_users] session.user.id:', session.user.id, 'users:', users.map((u: any) => u.id));
  return layout_view_page(ctx, session, "Users", users_view_page(ctx, session, users));
}
