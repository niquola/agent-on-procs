import type { Context } from "./ctx.ts";

export async function issues_assign(ctx: Context, issueId: string, userId: string | null) {
  const [row] = await ctx.db`
    UPDATE issues SET assignee_id = ${userId}, updated_at = now()
    WHERE id = ${issueId} RETURNING *
  `;
  return row ?? null;
}
