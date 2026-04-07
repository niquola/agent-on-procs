import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { tasks_db_list } from "./tasks.ts";
import { tasks_view_page } from "./tasks_view_page.tsx";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function(ctx: Context, session: Session, req: Request) {
  const tasks = await tasks_db_list(ctx);
  return layout_view_page(ctx, session, "Tasks", tasks_view_page(ctx, tasks));
}
