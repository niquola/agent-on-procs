import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { tasks_db_delete } from "./tasks.ts";

export default async function(ctx: Context, session: Session, req: Request, params: { id: string }) {
  await tasks_db_delete(ctx, params.id);
  return "";
}
