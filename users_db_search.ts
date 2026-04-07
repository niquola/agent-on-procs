// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Users } from "./users_db_type_Users.ts";

export async function users_db_search(ctx: Context, query: string): Promise<Users[]> {
  const rows = await ctx.db`SELECT * FROM users WHERE id ILIKE ${'%' + query + '%'} OR name ILIKE ${'%' + query + '%'} OR email ILIKE ${'%' + query + '%'} OR password_hash ILIKE ${'%' + query + '%'} ORDER BY created_at`;
  return rows as Users[];
}
