import type { Context } from "./ctx.ts";
import type { Users } from "./users.ts";

export function users_view_list(ctx: Context, users: Users[]): string {
  return (
    <div data-file="users_view_list">
      <ul className="space-y-1">
        {users.map((u) => users_view_item(ctx, u))}
      </ul>
    </div>
  );
}

export function users_view_item(ctx: Context, u: Users): string {
  return (
    <li data-view="user-item" className="flex items-center gap-3 py-3 border-b border-gray-200">
      <span data-role="name" className="font-medium text-gray-900">{u.name}</span>
      <span data-role="email" className="text-sm text-gray-500">{u.email}</span>
    </li>
  );
}
