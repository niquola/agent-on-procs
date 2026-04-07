// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Issues } from "./issues_db_type_Issues.ts";

export async function issues_db_search(ctx: Context, query: string): Promise<Issues[]> {
  const rows = await ctx.db`SELECT * FROM issues WHERE id ILIKE ${'%' + query + '%'} OR title ILIKE ${'%' + query + '%'} OR status ILIKE ${'%' + query + '%'} OR user_id ILIKE ${'%' + query + '%'} OR body ILIKE ${'%' + query + '%'} OR assignee_id ILIKE ${'%' + query + '%'} ORDER BY created_at`;
  return rows as Issues[];
}
