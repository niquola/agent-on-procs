import type { Context } from "./ctx.ts";
import type { UserWithStats } from "./users_getAll.ts";
import { users_view_list } from "./users_view_list.tsx";

export function users_view_page(ctx: Context, users: UserWithStats[]): string {
  return (
    <div data-page="users-list">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>
      {users_view_list(ctx, users)}
    </div>
  );
}
