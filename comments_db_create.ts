// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Comments } from "./comments_db_type_Comments.ts";

export type CommentsCreate = {
  issue_id: Comments["issue_id"];
  user_id: Comments["user_id"];
  body: Comments["body"];
  id?: Comments["id"];
  created_at?: Comments["created_at"];
};

export async function comments_db_create(ctx: Context, data: CommentsCreate): Promise<Comments> {
  const [row] = await ctx.db`INSERT INTO comments ${ctx.db(data)} RETURNING *`;
  return row as Comments;
}
