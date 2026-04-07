import type { Context } from "./ctx.ts";
import type { UserWithStats } from "./users_getAll.ts";

export function users_view_list(ctx: Context, users: UserWithStats[]): string {
  return (
    <div className="space-y-1">
      {users.length === 0 && <p className="text-gray-400 text-sm py-4">No users yet.</p>}
      {users.map((u) => users_view_item(ctx, u))}
    </div>
  );
}

function initials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export function users_view_item(ctx: Context, u: UserWithStats): string {
  return (
    <a href={`/users/${u.id}`} data-entity="user" data-id={u.id} className="flex items-center gap-3 py-3 border-b border-gray-200 hover:bg-gray-50 px-2 -mx-2 rounded transition">
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
  );
}
