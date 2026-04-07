// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Issues } from "./issues_db_type_Issues.ts";

export async function issues_db_list(ctx: Context): Promise<Issues[]> {
  const rows = await ctx.db`SELECT * FROM issues ORDER BY created_at`;
  return rows as Issues[];
}
