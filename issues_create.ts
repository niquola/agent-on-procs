import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";

type IssueInput = {
  title: string;
  body: string;
};

export async function issues_create(ctx: Context, session: Session, input: IssueInput) {
  const [row] = await ctx.db`
    INSERT INTO issues (title, body, status, user_id)
    VALUES (${input.title}, ${input.body}, 'open', ${session.user.id})
    RETURNING *
  `;
  return row as { id: string; title: string; body: string; status: string; user_id: string; created_at: Date; updated_at: Date };
}
