ALTER TABLE users ADD COLUMN password_hash TEXT;

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '30 days'
);

CREATE INDEX sessions_user_id_idx ON sessions(user_id);
