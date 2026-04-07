import type { ColumnInfo } from "./codegen_introspect.ts";

const PG_TO_TS: Record<string, string> = {
  text: "string",
  varchar: "string",
  char: "string",
  uuid: "string",
  int2: "number",
  int4: "number",
  int8: "number",
  float4: "number",
  float8: "number",
  numeric: "number",
  bool: "boolean",
  timestamptz: "Date",
  timestamp: "Date",
  date: "Date",
  jsonb: "unknown",
  json: "unknown",
};

function pgTypeToTs(col: ColumnInfo): string {
  if (col.comment) return col.comment;
  return PG_TO_TS[col.udt_name] ?? "unknown";
}

function pascalCase(s: string): string {
  return s.split("_").map((w) => w[0]!.toUpperCase() + w.slice(1)).join("");
}

export function codegen_generateType(table: string, cols: ColumnInfo[]): string {
  const typeName = pascalCase(table);
  const fields = cols.map((c) => {
    const tsType = pgTypeToTs(c);
    const optional = c.is_nullable ? "?" : "";
    return `  ${c.column_name}${optional}: ${tsType};`;
  });

  return `// Auto-generated from table "${table}" — do not edit. Re-run codegen to update.
// Source: ${table}_db_type_${typeName}.ts

export type ${typeName} = {
${fields.join("\n")}
};
`;
}
