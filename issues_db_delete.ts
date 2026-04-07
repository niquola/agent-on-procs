// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Issues } from "./issues_db_type_Issues.ts";

export async function issues_db_delete(ctx: Context, id: string): Promise<boolean> {
  const [row] = await ctx.db`DELETE FROM issues WHERE id = ${id} RETURNING id`;
  return !!row;
}
