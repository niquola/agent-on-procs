// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Sessions } from "./sessions_db_type_Sessions.ts";

export type SessionsCreate = {
  id: Sessions["id"];
  user_id: Sessions["user_id"];
  created_at?: Sessions["created_at"];
  expires_at?: Sessions["expires_at"];
};

export async function sessions_db_create(ctx: Context, data: SessionsCreate): Promise<Sessions> {
  const [row] = await ctx.db`INSERT INTO sessions ${ctx.db(data)} RETURNING *`;
  return row as Sessions;
}
