import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { auth_guard } from "./auth_guard.ts";

type Handler = (ctx: Context, session: Session | null, req: Request, params: Record<string, string>) => Promise<string | Response | null>;

// page_issues.tsx                   → GET /issues (full page)
// page_issues_$id.tsx               → GET /issues/:id
// frag_issues_search.tsx            → GET /issues/search (htmx fragment)
// form_issues_POST.tsx              → POST /issues
// form_issues_$id_close_POST.tsx    → POST /issues/:id/close
// api_issues_GET.tsx                → GET /issues (JSON, future)

function parsePath(parts: string[]): string {
  const mapped = parts.map((p) => (p.startsWith("$") ? ":" + p.slice(1) : p));
  return "/" + mapped.join("/");
}

function parsePageFile(filename: string): { method: string; path: string } {
  const name = filename.replace(/\.tsx?$/, "").replace(/^page_/, "");
  if (name === "index") return { method: "GET", path: "/" };
  return { method: "GET", path: parsePath(name.split("_")) };
}

function parseFragFile(filename: string): { method: string; path: string } {
  const name = filename.replace(/\.tsx?$/, "").replace(/^frag_/, "");
  return { method: "GET", path: parsePath(name.split("_")) };
}

function parseFormFile(filename: string): { method: string; path: string } {
  const name = filename.replace(/\.tsx?$/, "").replace(/^form_/, "");
  const parts = name.split("_");
  const method = parts[parts.length - 1]!;
  const pathParts = parts.slice(0, -1);
  return { method, path: parsePath(pathParts) };
}

function parseApiFile(filename: string): { method: string; path: string } {
  const name = filename.replace(/\.tsx?$/, "").replace(/^api_/, "");
  const parts = name.split("_");
  const method = parts[parts.length - 1]!;
  const pathParts = parts.slice(0, -1);
  return { method, path: parsePath(pathParts) };
}

export async function router_buildRoutes(dir: string, ctx: Context) {
  const globs = [
    { glob: new Bun.Glob("page_*.tsx"), parse: parsePageFile },
    { glob: new Bun.Glob("frag_*.tsx"), parse: parseFragFile },
    { glob: new Bun.Glob("form_*.tsx"), parse: parseFormFile },
    { glob: new Bun.Glob("api_*.tsx"), parse: parseApiFile },
  ];

  const routes: Record<string, Record<string, Function>> = {};

  for (const { glob, parse } of globs) {
    const files = Array.from(glob.scanSync(dir)).sort();
    for (const file of files) {
      const { method, path } = parse(file);
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
  }

  return routes;
}
