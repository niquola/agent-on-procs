import type { ColumnInfo } from "./codegen_introspect.ts";

function pascalCase(s: string): string {
  return s.split("_").map((w) => w[0]!.toUpperCase() + w.slice(1)).join("");
}

function findPk(cols: ColumnInfo[]): string {
  return cols.find((c) => c.column_name === "id")?.column_name ?? cols[0]!.column_name;
}

export function codegen_generateCrud(table: string, cols: ColumnInfo[]): Record<string, string> {
  const typeName = pascalCase(table);
  const pk = findPk(cols);
  const typeImport = `import type { ${typeName} } from "./${table}_db_type_${typeName}.ts";`;
  const ctxImport = `import type { Context } from "./ctx.ts";`;
  const header = `// Auto-generated — do not edit. Re-run codegen to update.\n`;

  const requiredCols = cols.filter((c) => !c.has_default && !c.is_nullable);
  const optionalCols = cols.filter((c) => c.has_default || c.is_nullable);

  const createFields = [
    ...requiredCols.filter((c) => c.column_name !== pk || !cols.find((x) => x.column_name === pk)?.has_default)
      .map((c) => `  ${c.column_name}: ${typeName}["${c.column_name}"];`),
    ...optionalCols.map((c) => `  ${c.column_name}?: ${typeName}["${c.column_name}"];`),
  ];

  const updateFields = cols
    .filter((c) => c.column_name !== pk)
    .map((c) => `  ${c.column_name}?: ${typeName}["${c.column_name}"];`);

  const files: Record<string, string> = {};
  const createTypeName = `${typeName}Create`;
  const updateTypeName = `${typeName}Update`;
  const orderCol = cols.find(c => c.column_name === 'created_at') ? 'created_at' : pk;

  // list
  files[`${table}_db_list.ts`] = `${header}${ctxImport}
${typeImport}

export async function ${table}_db_list(ctx: Context): Promise<${typeName}[]> {
  const rows = await ctx.db\`SELECT * FROM ${table} ORDER BY ${orderCol}\`;
  return rows as ${typeName}[];
}
`;

  // getById
  files[`${table}_db_getById.ts`] = `${header}${ctxImport}
${typeImport}

export async function ${table}_db_getById(ctx: Context, ${pk}: string): Promise<${typeName} | null> {
  const [row] = await ctx.db\`SELECT * FROM ${table} WHERE ${pk} = \${${pk}}\`;
  return (row as ${typeName}) ?? null;
}
`;

  // create
  files[`${table}_db_create.ts`] = `${header}${ctxImport}
${typeImport}

export type ${createTypeName} = {
${createFields.join("\n")}
};

export async function ${table}_db_create(ctx: Context, data: ${createTypeName}): Promise<${typeName}> {
  const [row] = await ctx.db\`INSERT INTO ${table} \${ctx.db(data)} RETURNING *\`;
  return row as ${typeName};
}
`;

  // update
  files[`${table}_db_update.ts`] = `${header}${ctxImport}
${typeImport}

export type ${updateTypeName} = {
${updateFields.join("\n")}
};

export async function ${table}_db_update(ctx: Context, ${pk}: string, data: ${updateTypeName}): Promise<${typeName} | null> {
  const [row] = await ctx.db\`UPDATE ${table} SET \${ctx.db(data)} WHERE ${pk} = \${${pk}} RETURNING *\`;
  return (row as ${typeName}) ?? null;
}
`;

  // delete
  files[`${table}_db_delete.ts`] = `${header}${ctxImport}
${typeImport}

export async function ${table}_db_delete(ctx: Context, ${pk}: string): Promise<boolean> {
  const [row] = await ctx.db\`DELETE FROM ${table} WHERE ${pk} = \${${pk}} RETURNING ${pk}\`;
  return !!row;
}
`;

  // search
  const textCols = cols.filter(c => ['text', 'varchar', 'char'].includes(c.udt_name));
  if (textCols.length > 0) {
    const whereClauses = textCols.map(c => `${c.column_name} ILIKE \${'%' + query + '%'}`).join(" OR ");
    files[`${table}_db_search.ts`] = `${header}${ctxImport}
${typeImport}

export async function ${table}_db_search(ctx: Context, query: string): Promise<${typeName}[]> {
  const rows = await ctx.db\`SELECT * FROM ${table} WHERE ${whereClauses} ORDER BY ${orderCol}\`;
  return rows as ${typeName}[];
}
`;
  }

  return files;
}
