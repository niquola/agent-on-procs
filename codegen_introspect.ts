import type { Context } from "./ctx.ts";

export type ColumnInfo = {
  column_name: string;
  data_type: string;
  udt_name: string;
  is_nullable: boolean;
  has_default: boolean;
  comment: string | null;
};

export async function codegen_introspect(ctx: Context, table: string, schema = "public"): Promise<ColumnInfo[]> {
  const rows = await ctx.db`
    SELECT
      c.column_name,
      c.data_type,
      c.udt_name,
      c.is_nullable = 'YES' AS is_nullable,
      c.column_default IS NOT NULL AS has_default,
      col_description(t.oid, c.ordinal_position) AS comment
    FROM information_schema.columns c
    JOIN pg_class t ON t.relname = c.table_name
    JOIN pg_namespace n ON n.oid = t.relnamespace AND n.nspname = c.table_schema
    WHERE c.table_schema = ${schema} AND c.table_name = ${table}
    ORDER BY c.ordinal_position
  `;
  return rows as ColumnInfo[];
}
