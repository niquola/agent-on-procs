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

export async function users_updateProfileAny(ctx: Context, session: Session, targetUserId: string, input: ProfileInput): Promise<ProfileResult> {
  const [user] = await ctx.db`SELECT password_hash FROM users WHERE id = ${targetUserId}`;
  if (!user) return { ok: false, error: "User not found" };

  // Check email uniqueness (if changed)
  if (input.email !== user.email) {
    const [existing] = await ctx.db`SELECT id FROM users WHERE email = ${input.email} AND id != ${targetUserId}`;
    if (existing) return { ok: false, error: "Email already taken" };
  }

  // Password change
  if (input.newPassword) {
    const hash = await auth_hashPassword(input.newPassword);
    await ctx.db`UPDATE users SET name = ${input.name}, email = ${input.email}, password_hash = ${hash} WHERE id = ${targetUserId}`;
  } else {
    await ctx.db`UPDATE users SET name = ${input.name}, email = ${input.email} WHERE id = ${targetUserId}`;
  }

  return { ok: true };
}
