import type { Context } from "./ctx.ts";

export async function migrations_getApplied(ctx: Context): Promise<Set<string>> {
  const rows = await ctx.db`SELECT name FROM _migrations ORDER BY name`;
  return new Set(rows.map((r: any) => r.name));
}
