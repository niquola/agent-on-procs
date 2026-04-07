ALTER TABLE tasks ADD COLUMN user_id TEXT REFERENCES users(id) ON DELETE CASCADE;
CREATE INDEX tasks_user_id_idx ON tasks(user_id);
