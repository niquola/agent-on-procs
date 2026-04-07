import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { users_updateProfileAny } from "./users_updateAnyProfile.ts";

export default async function (ctx: Context, session: Session, req: Request, params: { id: string }) {
  const form = await req.formData();
  const name = (form.get("name") as string)?.trim();
  const email = (form.get("email") as string)?.trim();
  const currentPassword = (form.get("current_password") as string) || undefined;
  const newPassword = (form.get("new_password") as string) || undefined;

  if (!name || !email) {
    return new Response(null, { status: 302, headers: { Location: `/users/${params.id}/edit` } });
  }

  const result = await users_updateProfileAny(ctx, session, params.id, { name, email, currentPassword, newPassword });

  if (!result.ok) {
    return new Response(null, { status: 302, headers: { Location: `/users/${params.id}/edit` } });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: `/users/${params.id}` },
  });
}
