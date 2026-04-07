---
description: Use Bun instead of Node.js, npm, pnpm, or vite.
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

## Style

Procedural style. The key building blocks are **functions** and **types**.

- Each function and each type goes in its own file.
- File naming convention. A directory listing (`ls *.ts *.tsx`) is effectively the inventory of all functions and types in the project.
  - Functions: `<module>_<functionName>.ts` — e.g. `user_findById.ts`, `config_parse.ts`, `order_calculateTotal.ts`
  - Views: `<module>_view_<name>.tsx` — e.g. `tasks_view_list.tsx`, `tasks_view_form.tsx`
  - Types: `<module>_type_<typeName>.ts` — e.g. `user_type_User.ts`, `order_type_LineItem.ts`
  - Generated (DB): `<module>_db_<function>.ts`, `<module>_db_type_<Type>.ts` — auto-generated from DB schema. Never edit — overwritten by codegen. Recognized by `_db_` in the name.
  - Names should be self-descriptive so you can understand what it does without opening the file.
- Functions take everything they need as parameters — no hidden internal state, no singletons, no closures over mutable variables. A function should be callable from anywhere with just its arguments.
- Prefer explicit data flow: pass dependencies in, return results out.
- **Strict TDD.** Always write tests BEFORE implementing the function. Red → Green → Refactor. No exceptions. Write the test, run it, see it fail, then implement the minimum code to pass.
  - Module tests: `<module>.test.ts` — tests for the whole module
  - Unit tests: `<module>_<function>.test.ts` — tests for a single function
  - View tests: `<module>_view.test.tsx` or `<module>_view_<name>.test.tsx`
- **Context pattern**: shared infrastructure (db connection, redis, config, etc.) lives in a `Context` type. Context is the first parameter of any function that needs infrastructure.
  - `ctx.ts` — Context type only (db, config — things created once at startup)
  - `ctx_start.ts` — `ctx_start()` function + pre-built `ctx` instance for `bun -e`
  - `<module>.ts` — barrel file with a brief module description comment at the top, re-exporting all module functions
  - Functions: `user_findById(ctx, id)`, `order_create(ctx, data)`, etc.
- **Session pattern**: per-request auth data lives in a `Session` type, separate from Context.
  - `session_type_Session.ts` — `Session` type: `{ id, user: { id, name, email } }`
  - Session is resolved by `auth_guard` from cookie on every request
  - `ctx` = shared infra (long-lived), `session` = per-request identity (short-lived)
  - **Parameter order convention** — `ctx` always first, `session` always second:
    - HTTP handlers: `(ctx, session, req, params)` → `string | Response | null`
    - Business logic: `tasks_create(ctx, session.user.id, title)` — pass what you need explicitly
    - Layout: `layout_view_page(ctx, session, title, body)` — both ctx and session
    - Views: `tasks_view_list(ctx, tasks)` — ctx first, then data
    - Views that need session: `some_view(ctx, session, data)` — ctx, session, then data

## Bun

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

## Key Bun APIs

Always prefer built-in Bun APIs over npm packages.

**Servers & Networking**
- `Bun.serve()` — HTTP/HTTPS server with routes, static files, WebSockets. Not express.
- `fetch()` — HTTP client (Web standard)
- `Bun.listen()` / `Bun.connect()` — raw TCP sockets
- `Bun.udpSocket()` — UDP sockets
- `Bun.dns` — DNS lookup

**Databases & Storage**
- `bun:sqlite` — SQLite built into runtime. Not better-sqlite3.
- `Bun.sql` — Postgres client. Not pg or postgres.js.
- `Bun.redis` — Redis/Valkey client. Not ioredis.
- `Bun.s3()` — S3-compatible object storage

**File System & Shell**
- `Bun.file()` — lazy file reference (reads on `.text()`, `.json()`, etc.)
- `Bun.write()` — write strings, Blobs, ArrayBuffers, Response, BunFile
- `Bun.Glob` — glob pattern matching. Not `glob` npm.
- `$\`cmd\`` — shell scripting with pipes, env, globs. Not execa.
- `Bun.spawn()` — child processes

**Crypto & Hashing**
- `Bun.hash()` — fast non-crypto hash (wyhash)
- `Bun.CryptoHasher` — SHA-256/512, MD5
- `Bun.password.hash/verify` — bcrypt/argon2

**Parsing & Formats**
- `Bun.TOML.parse` — TOML
- Native import for YAML, JSON5, JSONL
- `Bun.markdown` — Markdown to HTML
- `Bun.semver` — semver comparison

**Compression**
- `Bun.gzipSync()` / `Bun.gunzipSync()`
- `Bun.deflateSync()` / `Bun.inflateSync()`
- `Bun.zstdCompress()` / `Bun.zstdDecompress()`

**Web & HTML**
- `HTMLRewriter` — streaming HTML transform
- `Bun.Cookie` / `Bun.CookieMap` — cookie parsing
- `Bun.escapeHTML()` — HTML entity escaping
- `Bun.CSRF` — CSRF token generate/verify

**Utilities**
- `Bun.sleep()` / `Bun.nanoseconds()` — timing
- `Bun.randomUUIDv7()` — UUID generation
- `Bun.deepEquals()` / `Bun.deepMatch()` — deep comparison
- `Bun.inspect()` — pretty-print objects
- `Bun.cron()` — cron scheduler

**Testing** — `bun:test` with `describe/test/expect`, mocks, snapshots. Not jest/vitest.

**Frontend** — `Bun.serve()` with HTML imports (`.tsx`, `.jsx`, `.css` bundled automatically). Not vite.

## Calling Functions with `bun -e`

Since every function is pure and takes all dependencies as parameters, you can call any function directly from the command line using `bun -e`. Use this to test, debug, and verify functions without a test harness.

```sh
# call db directly
bun -e "import { ctx } from './ctx_start.ts'; console.log(await ctx.db\`SELECT version()\`)"

# call a function through context
bun -e "import { ctx } from './ctx_start.ts'; import { user_findById } from './user_findById.ts'; console.log(await user_findById(ctx, 'user-123'))"

# pure function without db
bun -e "import { transform } from './transform.ts'; console.log(transform({ name: 'Alice', age: 30 }))"
```

This works because functions have no hidden state — everything goes through parameters. Prefer `bun -e` for quick validation during development. Use `bun test` for persistent regression tests.

## Testing

Tests go in `<module>.test.ts` files. Use `test_ctx.ts` for test database setup.

Two strategies for test isolation:

**1. Fresh database per test file** (current) — `createTestContext()` creates a unique db, `destroyTestContext()` drops it:

```ts
import { createTestContext, destroyTestContext } from "./test_ctx.ts";
import { migrations_run } from "./migrations.ts";

let ctx: Context;
beforeAll(async () => {
  ctx = await createTestContext();
  await migrations_run(ctx, "./migrations");
});
afterAll(() => destroyTestContext(ctx));

test("my function", async () => {
  const result = await myFunction(ctx, ...);
  expect(result).toBe(...);
});
```

**2. Transaction rollback per test** (faster) — `test_withTx.ts` wraps each test in a transaction that rolls back. No cleanup, instant isolation:

```ts
import { test_withTx } from "./test_withTx.ts";

test("my function", test_withTx(() => ctx, async (txCtx) => {
  await tasks_create(txCtx, "temp task");
  // rolled back automatically — db stays clean
}));
```

Views are tested the same way — no server, no browser needed. Since views are just `(ctx, data) → string`, test the HTML output directly.

**Use `data-` attributes for test selectors, never CSS classes.** Classes change with styling, data-attributes are stable.

Convention:
- `data-file="tasks_view_list"` — source file name (without extension), always on root element of each view function
- `data-view="task-item"` — identifies a view component
- `data-role="title"` — identifies a semantic element within a view
- `data-action="done"` — identifies an interactive element (button, link)
- `data-status="todo"` — identifies state

Use `test_html.ts` helpers to query HTML with CSS selectors (built on Bun's `HTMLRewriter`, no npm):

```ts
import { queryExists, queryCount, queryTexts, queryAttrs } from "./test_html.ts";

test("renders task with done button", async () => {
  const task = await tasks_create(ctx, "My task");
  const html = tasks_view_item(ctx, task);
  expect(queryExists(html, '[data-view="task-item"]')).toBe(true);
  expect(queryAttrs(html, "[data-view]", "data-status")).toEqual(["todo"]);
  expect(queryTexts(html, '[data-role="title"]')).toEqual(["My task"]);
  expect(queryExists(html, '[data-action="done"]')).toBe(true);
});
```

Helpers: `queryExists(html, sel)`, `queryCount(html, sel)`, `queryTexts(html, sel)`, `queryAttrs(html, sel, attr)`.

Logic tests go in `<module>.test.ts`, view tests in `<module>_view.test.tsx`.

Run: `bun test` or `bun test tasks.test.ts`.

## Views (SSR)

Server-side HTML rendering via custom JSX runtime (`jsx.ts`). JSX compiles to plain HTML strings — no React, no virtual DOM. Components are pure functions: `(props) → string`.

- File naming: `<module>_view_<name>.tsx` — e.g. `tasks_view_list.tsx`, `tasks_view_form.tsx`
- Views take `ctx` as first parameter, then data. Layout takes `(ctx, session, title, body)`
- Use htmx attributes (`hx-get`, `hx-post`, `hx-swap`, `hx-target`) for interactivity
- `tsconfig.json` configured with `jsxImportSource: "."` pointing to local `jsx-runtime.ts`

```tsx
// tasks_view_list.tsx — rendering, takes ctx + data, returns HTML string
export function tasks_view_list(ctx: Context, tasks: Task[]): string {
  return (<ul>{tasks.map((t) => <li>{t.title}</li>)}</ul>);
}

// layout_view_page.tsx — wraps body in full HTML page with nav
export function layout_view_page(ctx: Context, session: Session | null, title: string, body: string): string { ... }
```

**Split logic and rendering.** A page/endpoint is always two functions — one does the logic (query, transform), the other renders HTML. This keeps logic testable without parsing HTML and views dumb.

```tsx
// HTTP_GET_tasks.tsx — handler wires logic + view
export default async function(ctx: Context, session: Session, req: Request) {
  const tasks = await tasks_db_list(ctx);                           // logic
  return layout_view_page(ctx, session, "Tasks", tasks_view_page(ctx, tasks)); // render
}
```

Views are testable with `bun -e` like any other function:
```sh
bun -e "import { ctx } from './ctx_start.ts'; import { tasks_db_list } from './tasks.ts'; import { tasks_view_list } from './tasks_view_list.tsx'; console.log(tasks_view_list(ctx, await tasks_db_list(ctx)))"
```

## Tailwind CSS

Use Tailwind v4 for styling. Import via CDN in layout or configure locally.

**Key classes:**
- Layout: `flex`, `grid`, `gap-*`, `items-center`, `justify-between`, `max-w-*`, `mx-auto`
- Spacing: `p-*`, `px-*`, `py-*`, `m-*`, `mt-*`, `mb-*`, `space-y-*`
- Typography: `text-sm`, `text-lg`, `text-xl`, `font-bold`, `font-medium`, `text-gray-500`
- Colors: `bg-white`, `bg-gray-100`, `text-gray-900`, `border-gray-200`
- Borders: `border`, `rounded`, `rounded-lg`, `rounded-full`, `shadow-sm`
- Buttons: `px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700`
- Inputs: `w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500`
- States: `hover:*`, `focus:*`, `active:*`, `disabled:opacity-50`
- Responsive: `sm:*`, `md:*`, `lg:*` (mobile-first)
- Dark: `dark:bg-gray-900`, `dark:text-white`
- Transitions: `transition`, `duration-200`, `ease-in-out`

Use utility classes directly in JSX views. No separate CSS files needed.

## htmx

Server returns HTML fragments, htmx swaps them into the page — no JS needed.

**Core attributes:**
- `hx-get="/url"`, `hx-post`, `hx-put`, `hx-delete` — HTTP request on event
- `hx-target="#id"` — where to put the response (`this`, `closest tr`, `find .class`, `next`, `previous`)
- `hx-swap="innerHTML"` — how to swap: `innerHTML`, `outerHTML`, `beforeend`, `afterbegin`, `delete`, `none`
- `hx-trigger="click"` — when to fire: `click`, `change`, `keyup`, `submit`, `load`, `revealed`, `every 2s`
- `hx-indicator="#spinner"` — show element during request
- `hx-confirm="Sure?"` — confirmation dialog before request
- `hx-vals='{"key":"val"}'` — extra JSON values with request
- `hx-include="#other-form"` — include inputs from another element
- `hx-push-url="true"` — update browser URL

**Trigger modifiers:** `hx-trigger="keyup changed delay:500ms"`, `hx-trigger="click throttle:1s"`

**Response headers from server:**
- `HX-Trigger: eventName` — trigger client event after swap
- `HX-Redirect: /url` — full redirect
- `HX-Retarget: #other` — change target
- `HX-Reswap: outerHTML` — change swap strategy

**How htmx fits our procedural style:**
- htmx requests hit `HTTP_*.tsx` route handlers
- Route handler calls logic function (`tasks_list`, `tasks_create`, etc.) to get data
- Then calls view function (`tasks_view_list`, `tasks_view_item`, etc.) to render HTML fragment
- htmx swaps that fragment into the page
- No JSON serialization, no client-side rendering, no JS state management
- Full pages return layout + view, htmx partials return just the view fragment
- Everything is testable without a browser — view functions return strings

## Routes

Each HTTP endpoint is a file: `HTTP_<METHOD>_<path>.tsx`. `$param` in filename becomes `:param` in route.

```
HTTP_GET_tasks.tsx              → GET /tasks
HTTP_POST_tasks.tsx             → POST /tasks
HTTP_PUT_tasks_$id_done.tsx     → PUT /tasks/:id/done
HTTP_DELETE_tasks_$id.tsx        → DELETE /tasks/:id
```

Each file exports a default function `(ctx, session, req, params) → string | Response | null`. Returns HTML string, `Response` for redirects/cookies, `null` for 404.

```tsx
// HTTP_GET_tasks.tsx
export default async function(ctx: Context, session: Session, req: Request) {
  const tasks = await tasks_db_list(ctx);
  return layout_view_page(ctx, session, "Tasks", tasks_view_page(ctx, tasks));
}
```

`router_buildRoutes.ts` auto-discovers all `HTTP_*.tsx` files and builds the route map. `server.ts` is just:

```ts
const routes = await router_buildRoutes(".", ctx);
Bun.serve({ port: 3000, routes });
```

- `ls HTTP_*.tsx` — see all endpoints
- `ls HTTP_*tasks*` — see all task routes
- Route handlers reuse module functions directly, no extra wrappers
- Handler receives `ctx.user` (current session user) — set by auth guard

## Auth

Cookie-based session auth. The router runs `auth_guard(ctx, req)` before every handler.

- `auth_guard.ts` — checks session cookie, resolves user, returns `Session | null` or `Response` (redirect to `/login`)
- `auth_isPublic(path)` — whitelist of paths that don't require auth (`/login`, `/register`)
- Public routes: `/login`, `/register` — accessible without session (handler gets `session = null`)
- Protected routes: everything else — redirect to `/login` if no valid session

**Session flow:**
1. `POST /login` or `POST /register` → `session_create(ctx, userId)` → `Set-Cookie: sid=<id>`
2. Every request → `auth_guard` reads `sid` cookie → `session_resolve` → `Session { id, user }`
3. `POST /logout` → `session_destroy(ctx, session.id)` → clear cookie → redirect `/login`

**Key files:**
- `session_type_Session.ts` — `Session` type definition
- `auth_guard.ts` — guard function called by router
- `auth_login.ts` / `auth_register.ts` — credential verification / user creation
- `auth_hashPassword.ts` / `auth_verifyPassword.ts` — bcrypt via `Bun.password`
- `session_create.ts` / `session_resolve.ts` / `session_destroy.ts` — session CRUD
- `session_getIdFromRequest.ts` — cookie parser

## Server

Run dev server in tmux (session name derived from project path to avoid conflicts):

```sh
# start
tmux new-session -d -s "$(basename $PWD)" 'bun --hot server.ts'

# logs
tmux capture-pane -t "$(basename $PWD)" -p -S -30

# stop
tmux kill-session -t "$(basename $PWD)"
```

`bun --hot` enables hot reload — code changes apply without restart.

## Migrations

SQL migrations in `migrations/` directory. Files: `<timestamp>-<name>.up.sql` / `.down.sql`.

```sh
# create new migration
bun -e "import { migrations_create } from './migrations_create.ts'; await migrations_create('./migrations', 'create-users')"

# apply pending
bun -e "import { ctx } from './ctx_start.ts'; import { migrations_run } from './migrations.ts'; await migrations_run(ctx, './migrations')"

# status
bun -e "import { ctx } from './ctx_start.ts'; import { migrations_status } from './migrations.ts'; await migrations_status(ctx, './migrations')"

# rollback
bun -e "import { ctx } from './ctx_start.ts'; import { migrations_rollback } from './migrations.ts'; await migrations_rollback(ctx, './migrations')"
```

## Codegen

Generate types and CRUD functions from PostgreSQL `information_schema`. Generated files have `_db_` in the name — always overwritten by codegen.

```sh
bun -e "import { ctx } from './ctx_start.ts'; import { codegen_run } from './codegen_run.ts'; await codegen_run(ctx, 'tasks')"
```

Generates per table (e.g. `tasks`):
```
tasks_db_type_Tasks.ts    — type from DB columns
tasks_db_create.ts        — INSERT
tasks_db_list.ts          — SELECT all
tasks_db_getById.ts       — SELECT by id
tasks_db_update.ts        — UPDATE
tasks_db_delete.ts        — DELETE
tasks_db_search.ts        — ILIKE search on text columns
```

**Never edit `_db_` files** — they are overwritten on each codegen run. Business logic goes in separate functions (e.g. `tasks_create.ts`) that call `_db_` functions internally.

- `ls *_db_*.ts` — all generated DB functions and types
- Run codegen after each migration to keep `_db_` files in sync with schema

**JSONB typing via SQL COMMENT:** add TypeScript type as column comment — codegen reads it and generates typed field instead of `unknown`.

```sql
COMMENT ON COLUMN users.settings IS '{ theme: string; lang: string }';
```
