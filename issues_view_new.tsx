import type { Context } from "./ctx.ts";
import { UI_Input } from "./UI_Input.tsx";
import { UI_Textarea } from "./UI_Textarea.tsx";
import { UI_Button } from "./UI_Button.tsx";
import { UI_Alert } from "./UI_Alert.tsx";

export function issues_view_new(ctx: Context, error?: string): string {
  return (
    <div data-page="issue-new">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Issue</h1>
      {error && <UI_Alert message={error} />}
      <form method="POST" action="/issues" data-form="create-issue" className="space-y-4">
        <UI_Input name="title" label="Title" required placeholder="Issue title" />
        <UI_Textarea name="body" label="Description" rows={6} placeholder="Describe the issue..." />
        <UI_Button action="create" type="submit" variant="success">Submit new issue</UI_Button>
      </form>
    </div>
  );
}
