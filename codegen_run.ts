import type { Context } from "./ctx.ts";
import { codegen_introspect } from "./codegen_introspect.ts";
import { codegen_generateType } from "./codegen_generateType.ts";
import { codegen_generateCrud } from "./codegen_generateCrud.ts";

function pascalCase(s: string): string {
  return s.split("_").map((w) => w[0]!.toUpperCase() + w.slice(1)).join("");
}

export async function codegen_run(ctx: Context, table: string, dir = ".") {
  const cols = await codegen_introspect(ctx, table);
  if (cols.length === 0) {
    console.log(`table "${table}" not found`);
    return;
  }

  const typeName = pascalCase(table);

  // type file
  const typeCode = codegen_generateType(table, cols);
  const typeFile = `${dir}/${table}_db_type_${typeName}.gen.ts`;
  await Bun.write(typeFile, typeCode);
  console.log(`  ${table}_db_type_${typeName}.gen.ts`);

  // crud files
  const crudFiles = codegen_generateCrud(table, cols);
  for (const [name, code] of Object.entries(crudFiles)) {
    await Bun.write(`${dir}/${name}`, code);
    console.log(`  ${name}`);
  }

  console.log(`done: ${Object.keys(crudFiles).length + 1} files for "${table}"`);
}
