import { UI_Input } from "./UI_Input.tsx";
import { UI_Button } from "./UI_Button.tsx";
import { UI_Alert } from "./UI_Alert.tsx";

export function users_view_register(error?: string): string {
  return (
    <div data-page="register">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      {error && <UI_Alert message={error} />}
      <form method="POST" action="/register" data-form="register" className="space-y-4">
        <UI_Input name="name" label="Name" required />
        <UI_Input name="email" label="Email" type="email" required />
        <UI_Input name="password" label="Password" type="password" required />
        <UI_Button action="register" type="submit">Register</UI_Button>
      </form>
      <p className="mt-4 text-sm text-gray-500 text-center">
        Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
      </p>
    </div>
  );
}
