ALTER TABLE issues ADD COLUMN assignee_id TEXT REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX issues_assignee_id_idx ON issues(assignee_id);
