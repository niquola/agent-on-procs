// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Comments } from "./comments_db_type_Comments.ts";

export async function comments_db_getById(ctx: Context, id: string): Promise<Comments | null> {
  const [row] = await ctx.db`SELECT * FROM comments WHERE id = ${id}`;
  return (row as Comments) ?? null;
}
