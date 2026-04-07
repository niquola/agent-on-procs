// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Comments } from "./comments_db_type_Comments.ts";

export type CommentsUpdate = {
  issue_id?: Comments["issue_id"];
  user_id?: Comments["user_id"];
  body?: Comments["body"];
  created_at?: Comments["created_at"];
};

export async function comments_db_update(ctx: Context, id: string, data: CommentsUpdate): Promise<Comments | null> {
  const [row] = await ctx.db`UPDATE comments SET ${ctx.db(data)} WHERE id = ${id} RETURNING *`;
  return (row as Comments) ?? null;
}
