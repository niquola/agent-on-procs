import type { Context } from "./ctx.ts";

export function layout_view_page(ctx: Context, title: string, body: string): string {
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
        <div className="max-w-2xl mx-auto px-4 py-10" dangerouslySetInnerHTML={{ __html: body }} />
      </body>
    </html>
  );
}
