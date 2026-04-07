import type { Context } from "./ctx.ts";

export function tasks_view_form(ctx: Context): string {
  return (
    <form data-view="task-form" data-file="tasks_view_form" hx-post="/tasks" hx-target="#tasks ul" hx-swap="beforeend" hx-on--after-request="this.reset()" className="flex gap-2 mb-6">
      <input type="text" name="title" data-role="title-input" placeholder="New task..." required
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400" />
      <button type="submit" data-action="add"
        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition duration-200">
        Add
      </button>
    </form>
  );
}
