import { UI_Input } from "./UI_Input.tsx";
import { UI_Button } from "./UI_Button.tsx";
import { UI_Alert } from "./UI_Alert.tsx";

export function auth_view_login(error?: string): string {
  return (
    <div data-page="login">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      {error && <UI_Alert message={error} />}
      <form method="POST" action="/login" data-form="login" className="space-y-4">
        <UI_Input name="email" label="Email" type="email" required />
        <UI_Input name="password" label="Password" type="password" required />
        <UI_Button action="login" type="submit">Sign in</UI_Button>
      </form>
    </div>
  );
}
