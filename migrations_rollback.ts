import type { Context } from "./ctx.ts";

export async function migrations_rollback(ctx: Context, dir: string, count: number = 1) {
  const rows = await ctx.db`
    SELECT name FROM _migrations ORDER BY applied_at DESC LIMIT ${count}
  `;

  if (rows.length === 0) {
    console.log("nothing to rollback");
    return;
  }

  for (const row of rows) {
    const downPath = `${dir}/${row.name}.down.sql`;
    const downFile = Bun.file(downPath);

    if (!(await downFile.exists())) {
      console.error(`no down migration: ${row.name}`);
      continue;
    }

    const sql = await downFile.text();
    console.log(`rollback: ${row.name}`);
    await ctx.db.begin(async (tx: any) => {
      await tx.unsafe(sql);
      await tx`DELETE FROM _migrations WHERE name = ${row.name}`;
    });
  }
}
