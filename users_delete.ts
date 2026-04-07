import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";

type DeleteResult = { ok: true } | { ok: false; error: string };

export async function users_delete(ctx: Context, session: Session, targetUserId: string): Promise<DeleteResult> {
  // Check if user exists
  const [user] = await ctx.db`SELECT id FROM users WHERE id = ${targetUserId}`;
  if (!user) return { ok: false, error: "User not found" };

  // Prevent deleting self
  if (session.user.id === targetUserId) {
    return { ok: false, error: "Cannot delete your own account" };
  }

  await ctx.db`DELETE FROM users WHERE id = ${targetUserId}`;

  return { ok: true };
}
