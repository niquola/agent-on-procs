DROP TABLE IF EXISTS comments;

UPDATE issues SET status = 'todo' WHERE status = 'open';
UPDATE issues SET status = 'done' WHERE status = 'closed';
ALTER TABLE issues DROP COLUMN IF EXISTS body;
ALTER INDEX issues_user_id_idx RENAME TO tasks_user_id_idx;
ALTER TABLE issues RENAME TO tasks;
