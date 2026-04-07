// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Sessions } from "./sessions_db_type_Sessions.ts";

export async function sessions_db_list(ctx: Context): Promise<Sessions[]> {
  const rows = await ctx.db`SELECT * FROM sessions ORDER BY created_at`;
  return rows as Sessions[];
}
