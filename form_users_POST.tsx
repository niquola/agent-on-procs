import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { auth_hashPassword } from "./auth_hashPassword.ts";
import { users_view_new } from "./users_view_new.tsx";
import { layout_view_page } from "./layout_view_page.tsx";

export default async function (ctx: Context, session: Session, req: Request) {
  const form = await req.formData();
  const name = (form.get("name") as string)?.trim();
  const email = (form.get("email") as string)?.trim();
  const password = (form.get("password") as string) || undefined;

  if (!name || !email || !password) {
    return layout_view_page(ctx, session, "Add User", users_view_new(ctx, session, "Name, email and password are required"));
  }

  const [existing] = await ctx.db`SELECT id FROM users WHERE email = ${email}`;
  if (existing) {
    return layout_view_page(ctx, session, "Add User", users_view_new(ctx, session, "Email already taken"));
  }

  const id = Bun.randomUUIDv7();
  const passwordHash = await auth_hashPassword(password);
  await ctx.db`INSERT INTO users ${ctx.db({ id, name, email, password_hash: passwordHash })} RETURNING *`;

  return new Response(null, {
    status: 302,
    headers: { Location: "/users" },
  });
}
