// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Users } from "./users_db_type_Users.ts";

export type UsersCreate = {
  id: Users["id"];
  name: Users["name"];
  email?: Users["email"];
  created_at?: Users["created_at"];
  password_hash?: Users["password_hash"];
};

export async function users_db_create(ctx: Context, data: UsersCreate): Promise<Users> {
  const [row] = await ctx.db`INSERT INTO users ${ctx.db(data)} RETURNING *`;
  return row as Users;
}
