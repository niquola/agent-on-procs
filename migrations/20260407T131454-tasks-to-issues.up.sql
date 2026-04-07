ALTER TABLE tasks RENAME TO issues;
ALTER TABLE issues ADD COLUMN body TEXT NOT NULL DEFAULT '';

-- status: open, closed (was: todo, in_progress, done)
UPDATE issues SET status = 'open' WHERE status IN ('todo', 'in_progress');
UPDATE issues SET status = 'closed' WHERE status = 'done';

ALTER INDEX tasks_user_id_idx RENAME TO issues_user_id_idx;

CREATE TABLE comments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  issue_id TEXT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX comments_issue_id_idx ON comments(issue_id);
