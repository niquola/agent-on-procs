// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Users } from "./users_db_type_Users.ts";

export async function users_db_list(ctx: Context): Promise<Users[]> {
  const rows = await ctx.db`SELECT * FROM users ORDER BY created_at`;
  return rows as Users[];
}
