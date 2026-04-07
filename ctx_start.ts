import { SQL } from "bun";
import type { Context } from "./ctx.ts";

export function ctx_start(): Context {
  const db = new SQL({
    hostname: process.env.PGHOST ?? "localhost",
    port: Number(process.env.PGPORT ?? 5432),
    database: process.env.PGDATABASE ?? "postgres",
    username: process.env.PGUSER ?? "postgres",
    password: process.env.PGPASSWORD ?? "postgres",
  });

  return { db };
}

export const ctx = ctx_start();
