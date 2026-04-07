import type { Context } from "./ctx.ts";

export async function migrations_ensureTable(ctx: Context) {
  await ctx.db`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}
