// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Comments } from "./comments_db_type_Comments.ts";

export async function comments_db_delete(ctx: Context, id: string): Promise<boolean> {
  const [row] = await ctx.db`DELETE FROM comments WHERE id = ${id} RETURNING id`;
  return !!row;
}
