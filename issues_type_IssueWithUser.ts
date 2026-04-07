export type IssueWithUser = {
  id: string;
  title: string;
  body: string;
  status: string;
  user_id: string;
  user_name: string;
  assignee_id: string | null;
  assignee_name: string | null;
  comment_count: number;
  created_at: Date;
  updated_at: Date;
};
