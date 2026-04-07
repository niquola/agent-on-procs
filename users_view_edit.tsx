import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { UI_Input } from "./UI_Input.tsx";
import { UI_Button } from "./UI_Button.tsx";

export function users_view_edit(ctx: Context, session: Session): string {
  return (
    <div data-page="profile-edit">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit User</h1>
      <form method="POST" action={`/users/${session.user.id}/edit`} data-form="edit-profile" className="space-y-4">
        <UI_Input name="name" label="Name" required value={session.user.name} />
        <UI_Input name="email" label="Email" type="email" required value={session.user.email} />
        <hr className="my-4 border-gray-200" />
        <p className="text-sm text-gray-500">Leave password fields empty to keep current password.</p>
        <UI_Input name="current_password" label="Current Password" type="password" />
        <UI_Input name="new_password" label="New Password" type="password" />
        <UI_Button action="save" type="submit" variant="primary">Save changes</UI_Button>
      </form>
    </div>
  );
}
