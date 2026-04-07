import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { auth_verifyPassword } from "./auth_verifyPassword.ts";
import { auth_hashPassword } from "./auth_hashPassword.ts";

type ProfileInput = {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
};

type ProfileResult = { ok: true } | { ok: false; error: string };

export async function users_updateProfile(ctx: Context, session: Session, input: ProfileInput): Promise<ProfileResult> {
  const [user] = await ctx.db`SELECT password_hash FROM users WHERE id = ${session.user.id}`;
  if (!user) return { ok: false, error: "User not found" };

  // Check email uniqueness (if changed)
  if (input.email !== session.user.email) {
    const [existing] = await ctx.db`SELECT id FROM users WHERE email = ${input.email} AND id != ${session.user.id}`;
    if (existing) return { ok: false, error: "Email already taken" };
  }

  // Password change
  if (input.newPassword) {
    if (!input.currentPassword) return { ok: false, error: "Current password is required" };
    const valid = await auth_verifyPassword(input.currentPassword, user.password_hash);
    if (!valid) return { ok: false, error: "Current password is incorrect" };
    const hash = await auth_hashPassword(input.newPassword);
    await ctx.db`UPDATE users SET name = ${input.name}, email = ${input.email}, password_hash = ${hash} WHERE id = ${session.user.id}`;
  } else {
    await ctx.db`UPDATE users SET name = ${input.name}, email = ${input.email} WHERE id = ${session.user.id}`;
  }

  return { ok: true };
}
