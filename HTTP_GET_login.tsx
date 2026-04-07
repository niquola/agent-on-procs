import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { layout_view_page } from "./layout_view_page.tsx";
import { auth_view_login } from "./auth_view_login.tsx";

export default async function (ctx: Context, session: Session | null, req: Request) {
  return layout_view_page(ctx, session, "Login", auth_view_login());
}
