import type { Context } from "./ctx.ts";

export async function session_create(ctx: Context, userId: string): Promise<string> {
  const id = Bun.randomUUIDv7();
  await ctx.db`
    INSERT INTO sessions (id, user_id) VALUES (${id}, ${userId})
  `;
  return id;
}
