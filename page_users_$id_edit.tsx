import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { users_getById } from "./users_getById.ts";
import { users_view_edit } from "./users_view_edit.tsx";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function (ctx: Context, session: Session, req: Request, params: { id: string }) {
  const user = await users_getById(ctx, params.id);
  if (!user) return null;

  // Only own profile
  if (session.user.id !== user.id) {
    return new Response(null, { status: 302, headers: { Location: `/users/${params.id}` } });
  }

  // Build a session-like object with target user data for the edit form
  const editSession = { ...session, user: { id: user.id, name: user.name, email: user.email ?? "" } };
  return layout_view_page(ctx, session, "Edit User", users_view_edit(ctx, editSession));
}
