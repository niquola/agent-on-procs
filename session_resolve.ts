import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";

export async function session_resolve(ctx: Context, sessionId: string): Promise<Session | null> {
  const [row] = await ctx.db`
    SELECT s.id as session_id, u.id, u.name, u.email
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.id = ${sessionId} AND s.expires_at > now()
  `;
  if (!row) return null;
  return {
    id: row.session_id,
    user: { id: row.id, name: row.name, email: row.email },
  };
}
