// Auto-generated from table "issues" — do not edit. Re-run codegen to update.
// Source: issues_db_type_Issues.ts

export type Issues = {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  created_at: Date;
  updated_at: Date;
  user_id?: string;
  body: string;
  assignee_id?: string;
};
