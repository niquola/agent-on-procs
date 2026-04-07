import type { Context } from "./ctx.ts";

export async function issues_close(ctx: Context, id: string) {
  const [row] = await ctx.db`
    UPDATE issues SET status = 'closed', updated_at = now() WHERE id = ${id} RETURNING *
  `;
  return row ?? null;
}
