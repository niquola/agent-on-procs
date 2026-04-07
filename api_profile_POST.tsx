import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { users_updateProfile } from "./users_updateProfile.ts";
import { users_view_edit } from "./users_view_edit.tsx";
import { layout_view_page } from "./layout_view_page.tsx";
import { session_resolve } from "./session_resolve.ts";

export default async function (ctx: Context, session: Session, req: Request) {
  const form = await req.formData();
  const name = (form.get("name") as string)?.trim();
  const email = (form.get("email") as string)?.trim();
  const currentPassword = (form.get("current_password") as string) || undefined;
  const newPassword = (form.get("new_password") as string) || undefined;
  const confirmPassword = (form.get("confirm_password") as string) || undefined;

  if (!name || !email) {
    return layout_view_page(ctx, session, "Edit Profile", users_view_edit(ctx, session, "Name and email are required"));
  }

  if (newPassword && newPassword !== confirmPassword) {
    return layout_view_page(ctx, session, "Edit Profile", users_view_edit(ctx, session, "Passwords do not match"));
  }

  const result = await users_updateProfile(ctx, session, { name, email, currentPassword, newPassword });

  if (!result.ok) {
    return layout_view_page(ctx, session, "Edit Profile", users_view_edit(ctx, session, result.error));
  }

  // Refresh session with updated user data
  const refreshed = await session_resolve(ctx, session.id);
  const updatedSession = refreshed ?? session;

  return layout_view_page(ctx, updatedSession, "Edit Profile", users_view_edit(ctx, updatedSession, undefined, "Profile updated"));
}
