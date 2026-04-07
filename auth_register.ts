import type { Context } from "./ctx.ts";
import { auth_hashPassword } from "./auth_hashPassword.ts";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type RegisterResult = {
  id: string;
  name: string;
  email: string;
};

export async function auth_register(ctx: Context, input: RegisterInput): Promise<RegisterResult> {
  const id = Bun.randomUUIDv7();
  const passwordHash = await auth_hashPassword(input.password);
  const [user] = await ctx.db`
    INSERT INTO users (id, name, email, password_hash)
    VALUES (${id}, ${input.name}, ${input.email}, ${passwordHash})
    RETURNING id, name, email
  `;
  return user as RegisterResult;
}
