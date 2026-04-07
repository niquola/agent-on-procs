import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";

export function layout_view_page(ctx: Context, session: Session | null, title: string, body: string): string {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <script src="https://unpkg.com/htmx.org@2.0.4"></script>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gray-50 min-h-screen">
        {session && (
          <nav className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <div className="flex gap-4 text-sm">
                <a href="/issues" className="text-gray-700 hover:text-gray-900">Issues</a>
                <a href="/users" className="text-gray-700 hover:text-gray-900">Users</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span data-role="user-name" className="text-gray-600">{session.user.name}</span>
                <form method="POST" action="/logout">
                  <button data-action="logout" className="text-gray-400 hover:text-gray-600">Logout</button>
                </form>
              </div>
            </div>
          </nav>
        )}
        <div className="max-w-2xl mx-auto px-4 py-10" dangerouslySetInnerHTML={{ __html: body }} />
      </body>
    </html>
  );
}
