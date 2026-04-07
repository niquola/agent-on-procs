// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Comments } from "./comments_db_type_Comments.ts";

export async function comments_db_list(ctx: Context): Promise<Comments[]> {
  const rows = await ctx.db`SELECT * FROM comments ORDER BY created_at`;
  return rows as Comments[];
}
