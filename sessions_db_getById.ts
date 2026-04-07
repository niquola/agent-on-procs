// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Sessions } from "./sessions_db_type_Sessions.ts";

export async function sessions_db_getById(ctx: Context, id: string): Promise<Sessions | null> {
  const [row] = await ctx.db`SELECT * FROM sessions WHERE id = ${id}`;
  return (row as Sessions) ?? null;
}
