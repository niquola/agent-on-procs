import type { Context } from "./ctx.ts";
import type { IssueWithUser } from "./issues_type_IssueWithUser.ts";
import { issues_view_list } from "./issues_view_list.tsx";

export function issues_view_page(ctx: Context, issues: IssueWithUser[]): string {
  return (
    <div data-view="issues-page" data-file="issues_view_page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
        <a href="/issues/new" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200 text-sm">
          New issue
        </a>
      </div>
      {issues_view_list(ctx, issues)}
    </div>
  );
}
