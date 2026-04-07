import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { tasks_db_create } from "./tasks.ts";
import { tasks_view_item } from "./tasks_view_list.tsx";

export default async function(ctx: Context, session: Session, req: Request) {
  const form = await req.formData();
  const title = form.get("title") as string;
  const task = await tasks_db_create(ctx, { title });
  return tasks_view_item(ctx, task);
}
