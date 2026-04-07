export type CommentWithUser = {
  id: string;
  issue_id: string;
  user_id: string;
  user_name: string;
  body: string;
  created_at: Date;
};
