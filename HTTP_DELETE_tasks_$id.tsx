import type { Context } from "./ctx.ts";
import { tasks_db_delete } from "./tasks.ts";

export default async function(ctx: Context, req: Request, params: { id: string }) {
  await tasks_db_delete(ctx, params.id);
  return "";
}
