import type { Context } from "./ctx.ts";
import type { IssueWithUser } from "./issues_type_IssueWithUser.ts";

export async function issues_listAll(ctx: Context): Promise<IssueWithUser[]> {
  const rows = await ctx.db`
    SELECT i.*, u.name as user_name,
      a.name as assignee_name,
      (SELECT count(*)::int FROM comments c WHERE c.issue_id = i.id) as comment_count
    FROM issues i
    JOIN users u ON u.id = i.user_id
    LEFT JOIN users a ON a.id = i.assignee_id
    ORDER BY i.created_at DESC
  `;
  return rows as IssueWithUser[];
}
