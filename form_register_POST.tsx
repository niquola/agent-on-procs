import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { layout_view_page } from "./layout_view_page.tsx";
import { users_view_register } from "./users_view_register.tsx";
import { auth_register } from "./auth_register.ts";
import { session_create } from "./session_create.ts";

export default async function (ctx: Context, session: Session | null, req: Request) {
  const form = await req.formData();
  const name = form.get("name") as string;
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  if (!name || !email || !password) {
    return layout_view_page(ctx, session, "Register", users_view_register("All fields are required"));
  }

  const [existing] = await ctx.db`SELECT id FROM users WHERE email = ${email}`;
  if (existing) {
    return layout_view_page(ctx, session, "Register", users_view_register("Email already taken"));
  }

  const user = await auth_register(ctx, { name, email, password });
  const sessionId = await session_create(ctx, user.id);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/issues",
      "Set-Cookie": `sid=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`,
    },
  });
}
