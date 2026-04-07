// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Issues } from "./issues_db_type_Issues.ts";

export async function issues_db_getById(ctx: Context, id: string): Promise<Issues | null> {
  const [row] = await ctx.db`SELECT * FROM issues WHERE id = ${id}`;
  return (row as Issues) ?? null;
}
