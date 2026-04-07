import type { Context } from "./ctx.ts";
import type { Migration } from "./migrations_type_Migration.ts";

export async function migrations_apply(ctx: Context, migration: Migration) {
  await ctx.db.begin(async (tx: any) => {
    await tx.unsafe(migration.up);
    await tx`INSERT INTO _migrations (name) VALUES (${migration.name})`;
  });
}
