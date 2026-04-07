import type { Context } from "./ctx.ts";
import type { Tasks } from "./tasks.ts";
import { tasks_view_form } from "./tasks_view_form.tsx";
import { tasks_view_list } from "./tasks_view_list.tsx";

export function tasks_view_page(ctx: Context, tasks: Tasks[]): string {
  return (
    <div data-view="tasks-page" data-file="tasks_view_page">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tasks</h1>
      {tasks_view_form(ctx)}
      {tasks_view_list(ctx, tasks)}
    </div>
  );
}
