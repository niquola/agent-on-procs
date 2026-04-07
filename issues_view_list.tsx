import type { Context } from "./ctx.ts";
import type { IssueWithUser } from "./issues_type_IssueWithUser.ts";

export function issues_view_list(ctx: Context, issues: IssueWithUser[]): string {
  return (
    <div id="issues-list">
      {issues.length === 0 && <p className="text-gray-400 text-sm py-4">No issues yet.</p>}
      {issues.map((i) => issues_view_item(ctx, i))}
    </div>
  );
}

export function issues_view_item(ctx: Context, i: IssueWithUser): string {
  const statusColor = i.status === "open" ? "text-green-600" : "text-purple-600";
  const statusIcon = i.status === "open" ? "○" : "●";
  return (
    <a href={`/issues/${i.id}`} data-entity="issue" data-id={i.id} data-status={i.status} className="flex items-center gap-3 py-3 border-b border-gray-200 hover:bg-gray-50 px-2 -mx-2 rounded transition">
      <span className={`text-sm ${statusColor}`}>{statusIcon}</span>
      <span data-role="title" className="flex-1 font-medium text-gray-900">{i.title}</span>
      {i.assignee_name && <span data-role="assignee" className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{i.assignee_name}</span>}
      <span data-role="comment-count" className="text-xs text-gray-400">{i.comment_count}</span>
      <span data-role="author" className="text-xs text-gray-500">{i.user_name}</span>
      <span data-role="status" className={`text-xs ${statusColor}`}>{i.status}</span>
    </a>
  );
}
