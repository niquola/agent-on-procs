import type { Migration } from "./migrations_type_Migration.ts";

export async function migrations_loadPending(dir: string, applied: Set<string>): Promise<Migration[]> {
  const glob = new Bun.Glob("*.up.sql");
  const files = Array.from(glob.scanSync(dir)).sort();

  const pending: Migration[] = [];
  for (const file of files) {
    const name = file.replace(".up.sql", "");
    if (!applied.has(name)) {
      const up = await Bun.file(`${dir}/${file}`).text();
      const downPath = `${dir}/${name}.down.sql`;
      const downFile = Bun.file(downPath);
      const down = (await downFile.exists()) ? await downFile.text() : null;
      pending.push({ name, up, down });
    }
  }

  return pending;
}
