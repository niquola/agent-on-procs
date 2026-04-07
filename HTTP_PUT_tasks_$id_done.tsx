import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { tasks_db_update } from "./tasks.ts";
import { tasks_view_item } from "./tasks_view_list.tsx";

export default async function(ctx: Context, session: Session, req: Request, params: { id: string }) {
  const task = await tasks_db_update(ctx, params.id, { status: "done" });
  return task ? tasks_view_item(ctx, task) : null;
}
