// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Users } from "./users_db_type_Users.ts";

export async function users_db_delete(ctx: Context, id: string): Promise<boolean> {
  const [row] = await ctx.db`DELETE FROM users WHERE id = ${id} RETURNING id`;
  return !!row;
}
