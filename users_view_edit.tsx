import type { Context } from "./ctx.ts";
import type { Session } from "./session_type_Session.ts";
import { UI_Input } from "./UI_Input.tsx";
import { UI_Button } from "./UI_Button.tsx";
import { UI_Alert } from "./UI_Alert.tsx";

export function users_view_edit(ctx: Context, session: Session, error?: string, success?: string): string {
  return (
    <div data-page="profile-edit">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>
      {error && <UI_Alert message={error} variant="error" />}
      {success && <UI_Alert message={success} variant="success" />}
      <form method="POST" action="/profile" data-form="edit-profile" className="space-y-4">
        <UI_Input name="name" label="Name" required value={session.user.name} />
        <UI_Input name="email" label="Email" type="email" required value={session.user.email} />
        <hr className="my-4 border-gray-200" />
        <p className="text-sm text-gray-500">Leave password fields empty to keep current password.</p>
        <UI_Input name="current_password" label="Current Password" type="password" />
        <UI_Input name="new_password" label="New Password" type="password" />
        <UI_Input name="confirm_password" label="Confirm New Password" type="password" />
        <UI_Button action="save" type="submit" variant="primary">Save changes</UI_Button>
      </form>
    </div>
  );
}
