import type { Context } from "./ctx.ts";

export type UserWithStats = {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  issue_count: number;
  comment_count: number;
};

export async function users_getAll(ctx: Context): Promise<UserWithStats[]> {
  const rows = await ctx.db`
    SELECT u.*,
      (SELECT count(*)::int FROM issues i WHERE i.user_id = u.id) as issue_count,
      (SELECT count(*)::int FROM comments c WHERE c.user_id = u.id) as comment_count
    FROM users u
    ORDER BY u.created_at
  `;
  return rows as UserWithStats[];
}
