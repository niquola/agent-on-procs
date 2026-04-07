// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Users } from "./users_db_type_Users.ts";

export async function users_db_getById(ctx: Context, id: string): Promise<Users | null> {
  const [row] = await ctx.db`SELECT * FROM users WHERE id = ${id}`;
  return (row as Users) ?? null;
}
