-- Preserve legacy billing records in the database, but remove them from the
-- application schema. No tables or user data are dropped in this migration.
-- Display names are not identifiers: existing duplicate names remain valid.
DROP INDEX IF EXISTS "projects_name_key";
ALTER TABLE "pomodoro_sessions" DROP CONSTRAINT IF EXISTS "pomodoro_sessions_taskId_fkey";
ALTER TABLE "pomodoro_sessions" ADD CONSTRAINT "pomodoro_sessions_taskId_fkey"
  FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
