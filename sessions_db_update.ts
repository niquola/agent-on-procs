// Auto-generated — do not edit. Re-run codegen to update.
import type { Context } from "./ctx.ts";
import type { Sessions } from "./sessions_db_type_Sessions.ts";

export type SessionsUpdate = {
  user_id?: Sessions["user_id"];
  created_at?: Sessions["created_at"];
  expires_at?: Sessions["expires_at"];
};

export async function sessions_db_update(ctx: Context, id: string, data: SessionsUpdate): Promise<Sessions | null> {
  const [row] = await ctx.db`UPDATE sessions SET ${ctx.db(data)} WHERE id = ${id} RETURNING *`;
  return (row as Sessions) ?? null;
}
