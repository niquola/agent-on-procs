// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Comments } from "./comments_db_type_Comments.ts";

export async function comments_db_search(ctx: Context, query: string): Promise<Comments[]> {
  const rows = await ctx.db`SELECT * FROM comments WHERE id ILIKE ${'%' + query + '%'} OR issue_id ILIKE ${'%' + query + '%'} OR user_id ILIKE ${'%' + query + '%'} OR body ILIKE ${'%' + query + '%'} ORDER BY created_at`;
  return rows as Comments[];
}
