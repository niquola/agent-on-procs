import { SQL } from "bun";
import type { Context } from "./ctx.ts";

let counter = 0;

export async function createTestContext(): Promise<Context> {
  const suffix = `${Date.now()}_${counter++}`;
  const dbName = `app_test_${suffix}`;

  const root = new SQL({
    hostname: process.env.PGHOST ?? "localhost",
    port: Number(process.env.PGPORT ?? 5432),
    database: "postgres",
    username: process.env.PGUSER ?? "postgres",
    password: process.env.PGPASSWORD ?? "postgres",
  });

  await root.unsafe(`DROP DATABASE IF EXISTS ${dbName}`);
  await root.unsafe(`CREATE DATABASE ${dbName}`);
  await root.close();

  const db = new SQL({
    hostname: process.env.PGHOST ?? "localhost",
    port: Number(process.env.PGPORT ?? 5432),
    database: dbName,
    username: process.env.PGUSER ?? "postgres",
    password: process.env.PGPASSWORD ?? "postgres",
  });

  (db as any)._testDbName = dbName;
  return { db };
}

export async function destroyTestContext(ctx: Context) {
  const dbName = (ctx.db as any)._testDbName;
  await ctx.db.close();

  const root = new SQL({
    hostname: process.env.PGHOST ?? "localhost",
    port: Number(process.env.PGPORT ?? 5432),
    database: "postgres",
    username: process.env.PGUSER ?? "postgres",
    password: process.env.PGPASSWORD ?? "postgres",
  });

  await root.unsafe(`DROP DATABASE IF EXISTS ${dbName}`);
  await root.close();
}
