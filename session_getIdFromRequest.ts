export function session_getIdFromRequest(req: Request): string | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const match = cookie.match(/(?:^|;\s*)sid=([^;]+)/);
  return match ? match[1] : null;
}
