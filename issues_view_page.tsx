import type { Context } from "./ctx.ts";
import type { IssueWithUser } from "./issues_type_IssueWithUser.ts";
import { issues_view_list } from "./issues_view_list.tsx";

export function issues_view_page(ctx: Context, issues: IssueWithUser[], query?: string): string {
  return (
    <div data-page="issues-list">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
        <a href="/issues/new" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200 text-sm">
          New issue
        </a>
      </div>
      <input
        type="search"
        name="q"
        value={query}
        placeholder="Search issues..."
        hx-get="/issues/search"
        hx-trigger="input delay:300ms, search"
        hx-target="#issues-list"
        hx-swap="innerHTML"
        className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <div id="issues-list">
        {issues_view_list(ctx, issues)}
      </div>
    </div>
  );
}
