import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import type { UserWithStats } from "./users_getAll.ts";
import { users_view_list } from "./users_view_list.tsx";

export function users_view_page(ctx: Context, session: Session | null, users: UserWithStats[]): string {
  return (
    <div data-page="users-list">
      {users_view_list(ctx, session, users)}
    </div>
  );
}
