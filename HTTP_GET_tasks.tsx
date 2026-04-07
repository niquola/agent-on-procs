import type { Context } from "./ctx.ts";
import { tasks_db_list } from "./tasks.ts";
import { tasks_view_page } from "./tasks_view_page.tsx";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function(ctx: Context, req: Request) {
  const tasks = await tasks_db_list(ctx);
  return layout_view_page(ctx, "Tasks", tasks_view_page(ctx, tasks));
}
