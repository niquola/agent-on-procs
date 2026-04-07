import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";

export async function comments_create(ctx: Context, session: Session, issueId: string, body: string) {
  const [row] = await ctx.db`
    INSERT INTO comments (issue_id, user_id, body)
    VALUES (${issueId}, ${session.user.id}, ${body})
    RETURNING *
  `;
  return row as { id: string; issue_id: string; user_id: string; body: string; created_at: Date };
}
