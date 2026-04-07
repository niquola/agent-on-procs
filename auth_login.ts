import type { Context } from "./ctx.ts";
import { auth_verifyPassword } from "./auth_verifyPassword.ts";

type LoginResult = {
  id: string;
  name: string;
  email: string;
};

export async function auth_login(ctx: Context, email: string, password: string): Promise<LoginResult | null> {
  const [user] = await ctx.db`
    SELECT id, name, email, password_hash FROM users WHERE email = ${email}
  `;
  if (!user || !user.password_hash) return null;

  const valid = await auth_verifyPassword(password, user.password_hash);
  if (!valid) return null;

  return { id: user.id, name: user.name, email: user.email };
}
