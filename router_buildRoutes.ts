import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { auth_guard } from "./auth_guard.ts";

type Handler = (ctx: Context, session: Session | null, req: Request, params: Record<string, string>) => Promise<string | Response | null>;

// HTTP_GET_tasks.tsx         → GET /tasks
// HTTP_POST_tasks.tsx        → POST /tasks
// HTTP_PUT_tasks_$id_done.tsx → PUT /tasks/:id/done
// HTTP_DELETE_tasks_$id.tsx   → DELETE /tasks/:id

function fileToRoute(filename: string): { method: string; path: string } {
  const name = filename.replace(/\.tsx?$/, "").replace(/^HTTP_/, "");
  const parts = name.split("_");
  const method = parts[0]!;
  const pathParts = parts.slice(1).map((p) => (p.startsWith("$") ? ":" + p.slice(1) : p));
  const path = "/" + pathParts.join("/");
  return { method, path };
}

export async function router_buildRoutes(dir: string, ctx: Context) {
  const glob = new Bun.Glob("HTTP_*.tsx");
  const files = Array.from(glob.scanSync(dir)).sort();

  const routes: Record<string, Record<string, Function>> = {};

  for (const file of files) {
    const { method, path } = fileToRoute(file);
    const mod = await import(`${dir}/${file}`);
    const handler: Handler = mod.default;

    if (!routes[path]) routes[path] = {};
    routes[path][method] = async (req: Request) => {
      const guardResult = await auth_guard(ctx, req);
      if (guardResult instanceof Response) return guardResult;

      const session: Session | null = guardResult;
      const result = await handler(ctx, session, req, req.params as any);
      if (result === null) return new Response("not found", { status: 404 });
      if (result instanceof Response) return result;
      return new Response(result, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    };
  }

  return routes;
}
