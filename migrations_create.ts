export async function migrations_create(dir: string, name: string) {
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0];
  const fileName = `${timestamp}-${name}`;

  const upPath = `${dir}/${fileName}.up.sql`;
  const downPath = `${dir}/${fileName}.down.sql`;

  await Bun.write(upPath, `-- ${name}\n\n`);
  await Bun.write(downPath, `-- rollback ${name}\n\n`);

  console.log(`created:`);
  console.log(`  ${fileName}.up.sql`);
  console.log(`  ${fileName}.down.sql`);
}
