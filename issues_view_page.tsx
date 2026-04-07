import type { Context } from "./ctx.ts";
import type { IssueWithUser } from "./issues_type_IssueWithUser.ts";
import { issues_view_list } from "./issues_view_list.tsx";
import { UI_Button } from "./UI_Button.tsx";
import { UI_TopBar } from "./UI_TopBar.tsx";

export function issues_view_page(ctx: Context, issues: IssueWithUser[], query?: string): string {
  return (
    <div data-page="issues-list">
      <UI_TopBar title="Issues" rightElement={<UI_Button href="/issues/new" variant="primary" action="create">New</UI_Button>} />
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
