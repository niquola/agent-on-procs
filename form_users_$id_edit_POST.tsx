import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { users_updateProfileAny } from "./users_updateAnyProfile.ts";
import { users_view_edit } from "./users_view_edit.tsx";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function (ctx: Context, session: Session, req: Request, params: { id: string }) {
  const form = await req.formData();
  const name = (form.get("name") as string)?.trim();
  const email = (form.get("email") as string)?.trim();
  const currentPassword = (form.get("current_password") as string) || undefined;
  const newPassword = (form.get("new_password") as string) || undefined;

  if (!name || !email) {
    return layout_view_page(ctx, session, "Edit User", users_view_edit(ctx, session));
  }

  // Update profile for the user in URL (params.id)
  const result = await users_updateProfileAny(ctx, session, params.id, { name, email, currentPassword, newPassword });

  if (!result.ok) {
    return layout_view_page(ctx, session, "Edit User", users_view_edit(ctx, session));
  }

  return layout_view_page(ctx, session, "Edit User", users_view_edit(ctx, session));
}
