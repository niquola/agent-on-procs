import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { UI_Input } from "./UI_Input.tsx";
import { UI_Button } from "./UI_Button.tsx";
import { UI_Alert } from "./UI_Alert.tsx";

export function users_view_new(ctx: Context, session: Session, error?: string): string {
  return (
    <div data-page="user-new">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New User</h1>
      {error && <UI_Alert message={error} />}
      <form method="POST" action="/users" data-form="add-user" className="space-y-4">
        <UI_Input name="name" label="Name" required />
        <UI_Input name="email" label="Email" type="email" required />
        <UI_Input name="password" label="Password" type="password" required />
        <UI_Button action="create" type="submit" variant="primary">Create User</UI_Button>
      </form>
    </div>
  );
}
