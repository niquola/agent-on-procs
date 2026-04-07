import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import type { UserWithStats } from "./users_getAll.ts";
import type { IssueWithUser } from "./issues_type_IssueWithUser.ts";
import { issues_view_list } from "./issues_view_list.tsx";
import { UI_Button } from "./UI_Button.tsx";

function initials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export function users_view_profile(ctx: Context, session: Session, user: UserWithStats, issues: IssueWithUser[]): string {
  return (
    <div data-page="user-profile" data-entity="user" data-id={user.id}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
          {initials(user.name)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            <span data-role="name">{user.name}</span>
          </h1>
          <span data-role="email" className="text-gray-500">{user.email}</span>
        </div>
      </div>

      <div className="flex gap-6 mb-6 text-sm text-gray-500">
        <span><span data-role="issue-count" className="font-semibold text-gray-900">{user.issue_count}</span> issues</span>
        <span><span data-role="comment-count" className="font-semibold text-gray-900">{user.comment_count}</span> comments</span>
      </div>

      {user.id === session.user.id && (
        <div className="mb-6">
          <UI_Button href={`/users/${user.id}/edit`} variant="outline">Edit Profile</UI_Button>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Issues by {user.name}</h2>
      {issues_view_list(ctx, issues)}
    </div>
  );
}
