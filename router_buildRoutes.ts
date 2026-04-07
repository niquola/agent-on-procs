import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { auth_guard } from "./auth_guard.ts";

type Handler = (ctx: Context, session: Session | null, req: Request, params: Record<string, string>) => Promise<string | Response | null>;

// http_issues.tsx                → GET /issues
// http_issues_$id.tsx            → GET /issues/:id
// http_issues_new.tsx            → GET /issues/new
// api_issues_POST.tsx            → POST /issues
// api_issues_$id_close_POST.tsx  → POST /issues/:id/close

function parseHttpFile(filename: string): { method: string; path: string } {
  const name = filename.replace(/\.tsx?$/, "").replace(/^http_/, "");
  if (name === "index") return { method: "GET", path: "/" };
  const parts = name.split("_").map((p) => (p.startsWith("$") ? ":" + p.slice(1) : p));
  const path = "/" + parts.join("/");
  return { method: "GET", path };
}

function parseApiFile(filename: string): { method: string; path: string } {
  const name = filename.replace(/\.tsx?$/, "").replace(/^api_/, "");
  const parts = name.split("_");
  const method = parts[parts.length - 1]!;
  const pathParts = parts.slice(0, -1).map((p) => (p.startsWith("$") ? ":" + p.slice(1) : p));
  const path = "/" + pathParts.join("/");
  return { method, path };
}

export async function router_buildRoutes(dir: string, ctx: Context) {
  const httpGlob = new Bun.Glob("http_*.tsx");
  const apiGlob = new Bun.Glob("api_*.tsx");
  const httpFiles = Array.from(httpGlob.scanSync(dir)).sort();
  const apiFiles = Array.from(apiGlob.scanSync(dir)).sort();

  const routes: Record<string, Record<string, Function>> = {};

  const allFiles = [
    ...httpFiles.map((f) => ({ file: f, ...parseHttpFile(f) })),
    ...apiFiles.map((f) => ({ file: f, ...parseApiFile(f) })),
  ];

  for (const { file, method, path } of allFiles) {
    const mod = await import(`${dir}/${file}`);
    const handler: Handler = mod.default;

    if (!routes[path]) routes[path] = {};
    routes[path]![method] = async (req: Request) => {
      const guardResult = await auth_guard(ctx, req);
      if (guardResult instanceof Response) return guardResult;

      const session: Session | null = guardResult;
      const result = await handler(ctx, session, req, (req as any).params ?? {});
      if (result === null) return new Response("not found", { status: 404 });
      if (result instanceof Response) return result;
      return new Response(result, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    };
  }

  return routes;
}
