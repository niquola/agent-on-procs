import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import type { UserWithStats } from "./users_getAll.ts";
import { UI_Button, type ButtonProps } from "./UI_Button.tsx";
import { UI_TopBar } from "./UI_TopBar.tsx";

export function users_view_list(ctx: Context, session: Session | null, users: UserWithStats[]): string {
  return (
    <div data-page="users-list">
      <UI_TopBar title="Users" rightElement={<UI_Button href="/users/new" variant="primary" action="create">New</UI_Button>} />
      <div className="space-y-1">
        {users.length === 0 && <p className="text-gray-400 text-sm py-4">No users yet.</p>}
        {users.map((u) => users_view_item(ctx, session, u))}
      </div>
    </div>
  );
}

function initials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export function users_view_item(ctx: Context, session: Session | null, u: UserWithStats): string {
  const isOwnProfile = session && session.user.id === u.id;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-200 px-2 -mx-2 rounded">
      <a href={`/users/${u.id}`} data-entity="user" data-id={u.id} className="flex items-center gap-3 flex-1 hover:bg-gray-50 transition">
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 shrink-0">
          {initials(u.name)}
        </div>
        <div className="flex-1">
          <span data-role="name" className="font-medium text-gray-900">{u.name}</span>
          <span data-role="email" className="text-sm text-gray-500 ml-2">{u.email}</span>
        </div>
        <span data-role="issue-count" className="text-xs text-gray-400">{u.issue_count} issues</span>
        <span data-role="comment-count" className="text-xs text-gray-400">{u.comment_count} comments</span>
      </a>
      <div className="flex items-center gap-2">
        {isOwnProfile && (
          <>
            <UI_Button href={`/users/${u.id}/edit`} variant="outline" action="edit">Edit</UI_Button>
          </>
        )}
      </div>
    </div>
  );
}
