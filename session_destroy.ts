import type { Context } from "./ctx.ts";

export async function session_destroy(ctx: Context, sessionId: string): Promise<void> {
  await ctx.db`DELETE FROM sessions WHERE id = ${sessionId}`;
}
