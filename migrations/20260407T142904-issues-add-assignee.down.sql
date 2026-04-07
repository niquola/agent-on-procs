DROP INDEX IF EXISTS issues_assignee_id_idx;
ALTER TABLE issues DROP COLUMN IF EXISTS assignee_id;
