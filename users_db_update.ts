// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Users } from "./users_db_type_Users.ts";

export type UsersUpdate = {
  name?: Users["name"];
  email?: Users["email"];
  created_at?: Users["created_at"];
  password_hash?: Users["password_hash"];
};

export async function users_db_update(ctx: Context, id: string, data: UsersUpdate): Promise<Users | null> {
  const [row] = await ctx.db`UPDATE users SET ${ctx.db(data)} WHERE id = ${id} RETURNING *`;
  return (row as Users) ?? null;
}
