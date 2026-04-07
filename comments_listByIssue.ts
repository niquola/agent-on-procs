import type { Context } from "./ctx.ts";
import type { CommentWithUser } from "./comments_type_CommentWithUser.ts";

export async function comments_listByIssue(ctx: Context, issueId: string): Promise<CommentWithUser[]> {
  const rows = await ctx.db`
    SELECT c.*, u.name as user_name
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.issue_id = ${issueId}
    ORDER BY c.created_at
  `;
  return rows as CommentWithUser[];
}
