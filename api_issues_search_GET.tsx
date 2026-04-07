import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { issues_search } from "./issues_search.ts";
import { issues_listAll } from "./issues_listAll.ts";
import { issues_view_list } from "./issues_view_list.tsx";

export default async function (ctx: Context, session: Session, req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("q")?.trim() ?? "";
  const issues = query ? await issues_search(ctx, query) : await issues_listAll(ctx);
  return issues_view_list(ctx, issues);
}
