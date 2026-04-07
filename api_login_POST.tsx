import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { layout_view_page } from "./layout_view_page.tsx";
import { auth_view_login } from "./auth_view_login.tsx";
import { auth_login } from "./auth_login.ts";
import { session_create } from "./session_create.ts";

export default async function (ctx: Context, session: Session | null, req: Request) {
  const form = await req.formData();
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  if (!email || !password) {
    return layout_view_page(ctx, session, "Login", auth_view_login("Email and password are required"));
  }

  const user = await auth_login(ctx, email, password);
  if (!user) {
    return layout_view_page(ctx, session, "Login", auth_view_login("Invalid email or password"));
  }

  const sessionId = await session_create(ctx, user.id);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/issues",
      "Set-Cookie": `sid=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`,
    },
  });
}
