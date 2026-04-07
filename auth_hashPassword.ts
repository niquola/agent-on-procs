export async function auth_hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password);
}
