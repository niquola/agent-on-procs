import type { Context } from "./ctx.ts";
import { migrations_ensureTable } from "./migrations_ensureTable.ts";
import { migrations_getApplied } from "./migrations_getApplied.ts";
import { migrations_loadPending } from "./migrations_loadPending.ts";
import { migrations_apply } from "./migrations_apply.ts";

export async function migrations_run(ctx: Context, dir: string) {
  await migrations_ensureTable(ctx);
  const applied = await migrations_getApplied(ctx);
  const pending = await migrations_loadPending(dir, applied);

  if (pending.length === 0) {
    console.log("no pending migrations");
    return;
  }

  for (const migration of pending) {
    console.log(`applying: ${migration.name}`);
    await migrations_apply(ctx, migration);
  }

  console.log(`done: ${pending.length} applied`);
}
