// Simple task management. CRUD operations on tasks table.
// Statuses: todo, in_progress, done.

export type { Tasks, TasksCreate, TasksUpdate } from "./tasks_db_create.gen.ts";
export { tasks_db_create } from "./tasks_db_create.gen.ts";
export { tasks_db_list } from "./tasks_db_list.gen.ts";
export { tasks_db_getById } from "./tasks_db_getById.gen.ts";
export { tasks_db_update } from "./tasks_db_update.gen.ts";
export { tasks_db_delete } from "./tasks_db_delete.gen.ts";
export { tasks_db_search } from "./tasks_db_search.gen.ts";
