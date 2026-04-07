import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function (ctx: Context, session: Session | null, req: Request) {
  const body = (
    <div data-file="http_index" className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Agent on Procs</h1>
      <p className="text-lg text-gray-500 mb-8">Procedural web framework for AI agents</p>
      {session ? (
        <a href="/issues" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Go to Issues
        </a>
      ) : (
        <div className="flex gap-4 justify-center">
          <a href="/login" className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition">
            Sign in
          </a>
          <a href="/register" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
            Register
          </a>
        </div>
      )}
    </div>
  );
  return layout_view_page(ctx, session, "Agent on Procs", body);
}
