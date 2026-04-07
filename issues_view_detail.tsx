import type { Context } from "./ctx.ts";
import type { IssueWithUser } from "./issues_type_IssueWithUser.ts";
import type { CommentWithUser } from "./comments_type_CommentWithUser.ts";
import { UI_Button } from "./UI_Button.tsx";
import { UI_Textarea } from "./UI_Textarea.tsx";
import { UI_Select } from "./UI_Select.tsx";

type UserOption = { id: string; name: string };

export function issues_view_detail(ctx: Context, issue: IssueWithUser, comments: CommentWithUser[], users?: UserOption[]): string {
  const statusColor = issue.status === "open" ? "text-green-600 bg-green-50 border-green-200" : "text-purple-600 bg-purple-50 border-purple-200";
  return (
    <div data-page="issue-detail" data-entity="issue" data-id={issue.id} data-status={issue.status}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          <span data-role="title">{issue.title}</span>
          <span className="text-gray-400 font-normal ml-2">#{issue.id.slice(0, 8)}</span>
        </h1>
        <div className="flex items-center gap-3 text-sm">
          <span className={`px-2 py-0.5 rounded-full border ${statusColor}`}>{issue.status}</span>
          <span><span data-role="author" className="font-medium">{issue.user_name}</span> opened this issue</span>
        </div>
      </div>

      <div className="flex gap-6 mb-6">
        <div className="flex-1">
          {issue.body && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 prose prose-sm" data-role="body">
              {issue.body}
            </div>
          )}
          <div className="flex gap-2 mb-6">
            {issue.status === "open" ? (
              <form method="POST" action={`/issues/${issue.id}/close`}>
                <UI_Button action="close" type="submit" variant="outline">Close issue</UI_Button>
              </form>
            ) : (
              <form method="POST" action={`/issues/${issue.id}/reopen`}>
                <UI_Button action="reopen" type="submit" variant="outline">Reopen issue</UI_Button>
              </form>
            )}
          </div>
        </div>

        <div className="w-48 shrink-0">
          <form method="POST" action={`/issues/${issue.id}/assign`} data-form="assign">
            <UI_Select
              name="assignee_id"
              label="Assignee"
              value={issue.assignee_id ?? ""}
              autosubmit
              options={[
                { value: "", label: "Unassigned" },
                ...(users?.map((u) => ({ value: u.id, label: u.name })) ?? []),
              ]}
            />
          </form>
          {issue.assignee_name && (
            <div data-role="assignee" className="text-sm text-gray-700 mt-2">{issue.assignee_name}</div>
          )}
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments ({comments.length})</h2>

      <div className="space-y-4 mb-6">
        {comments.map((c) => (
          <div data-entity="comment" data-id={c.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2 text-sm">
              <span data-role="comment-author" className="font-medium text-gray-900">{c.user_name}</span>
              <span className="text-gray-400">commented</span>
            </div>
            <div data-role="comment-body" className="text-gray-700 text-sm">{c.body}</div>
          </div>
        ))}
      </div>

      <form method="POST" action={`/issues/${issue.id}/comments`} data-form="add-comment" className="space-y-3">
        <UI_Textarea name="body" rows={3} required placeholder="Leave a comment..." />
        <UI_Button action="comment" type="submit">Comment</UI_Button>
      </form>
    </div>
  );
}
