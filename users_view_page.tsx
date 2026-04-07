import type { Context } from "./ctx.ts";
import type { Users } from "./users.ts";
import { users_view_list } from "./users_view_list.tsx";

export function users_view_page(ctx: Context, users: Users[]): string {
  return (
    <div data-view="users-page" data-file="users_view_page">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>
      {users_view_list(ctx, users)}
    </div>
  );
}
