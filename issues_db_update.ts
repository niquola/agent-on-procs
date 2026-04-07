// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Issues } from "./issues_db_type_Issues.ts";

export type IssuesUpdate = {
  title?: Issues["title"];
  status?: Issues["status"];
  created_at?: Issues["created_at"];
  updated_at?: Issues["updated_at"];
  user_id?: Issues["user_id"];
  body?: Issues["body"];
  assignee_id?: Issues["assignee_id"];
};

export async function issues_db_update(ctx: Context, id: string, data: IssuesUpdate): Promise<Issues | null> {
  const [row] = await ctx.db`UPDATE issues SET ${ctx.db(data)} WHERE id = ${id} RETURNING *`;
  return (row as Issues) ?? null;
}
