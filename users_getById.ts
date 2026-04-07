import type { Context } from "./ctx.ts";
import type { UserWithStats } from "./users_getAll.ts";

export async function users_getById(ctx: Context, id: string): Promise<UserWithStats | null> {
  const [row] = await ctx.db`
    SELECT u.*,
      (SELECT count(*)::int FROM issues i WHERE i.user_id = u.id) as issue_count,
      (SELECT count(*)::int FROM comments c WHERE c.user_id = u.id) as comment_count
    FROM users u
    WHERE u.id = ${id}
  `;
  return (row as UserWithStats) ?? null;
}
