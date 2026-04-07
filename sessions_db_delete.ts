// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Sessions } from "./sessions_db_type_Sessions.ts";

export async function sessions_db_delete(ctx: Context, id: string): Promise<boolean> {
  const [row] = await ctx.db`DELETE FROM sessions WHERE id = ${id} RETURNING id`;
  return !!row;
}
