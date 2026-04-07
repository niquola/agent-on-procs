import type { Context } from "./ctx.ts";
import type { Tasks } from "./tasks.ts";

export function tasks_view_list(ctx: Context, tasks: Tasks[]): string {
  return (
    <div id="tasks" data-view="tasks-list" data-file="tasks_view_list">
      <ul className="space-y-1">
        {tasks.map((t) => tasks_view_item(ctx, t))}
      </ul>
    </div>
  );
}

export function tasks_view_item(ctx: Context, t: Tasks): string {
  return (
    <li id={`task-${t.id}`} data-view="task-item" data-file="tasks_view_list" data-status={t.status} className="flex items-center gap-3 py-3 border-b border-gray-200">
      <span data-role="title" className={t.status === "done" ? "flex-1 line-through text-gray-400" : "flex-1 text-gray-900"}>
        {t.title}
      </span>
      <span data-role="status" className="text-xs text-gray-400">{t.status}</span>
      {t.status !== "done" && (
        <button
          data-action="done"
          hx-put={`/tasks/${t.id}/done`}
          hx-target={`#task-${t.id}`}
          hx-swap="outerHTML"
          className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
        >done</button>
      )}
      <button
        data-action="delete"
        hx-delete={`/tasks/${t.id}`}
        hx-target={`#task-${t.id}`}
        hx-swap="delete"
        className="text-xs px-2 py-1 text-red-400 border border-red-200 rounded hover:bg-red-50 transition"
      >x</button>
    </li>
  );
}
