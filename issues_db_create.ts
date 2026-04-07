// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Issues } from "./issues_db_type_Issues.ts";

export type IssuesCreate = {
  title: Issues["title"];
  id?: Issues["id"];
  status?: Issues["status"];
  created_at?: Issues["created_at"];
  updated_at?: Issues["updated_at"];
  user_id?: Issues["user_id"];
  body?: Issues["body"];
  assignee_id?: Issues["assignee_id"];
};

export async function issues_db_create(ctx: Context, data: IssuesCreate): Promise<Issues> {
  const [row] = await ctx.db`INSERT INTO issues ${ctx.db(data)} RETURNING *`;
  return row as Issues;
}
