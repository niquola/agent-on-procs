import type { Context } from "./ctx.ts";
import { migrations_ensureTable } from "./migrations_ensureTable.ts";
import { migrations_getApplied } from "./migrations_getApplied.ts";

export async function migrations_status(ctx: Context, dir: string) {
  await migrations_ensureTable(ctx);
  const applied = await migrations_getApplied(ctx);

  const glob = new Bun.Glob("*.up.sql");
  const files = Array.from(glob.scanSync(dir)).sort();
  const names = files.map((f) => f.replace(".up.sql", ""));

  if (names.length === 0) {
    console.log("no migrations found");
    return;
  }

  for (const name of names) {
    const status = applied.has(name) ? "[x]" : "[ ]";
    console.log(`${status} ${name}`);
  }

  const pending = names.length - applied.size;
  console.log(`\ntotal: ${names.length}, applied: ${applied.size}, pending: ${pending}`);
}
