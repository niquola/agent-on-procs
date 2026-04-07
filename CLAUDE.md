---
description: Use Bun instead of Node.js, npm, pnpm, or vite.
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

## Style — Agent on Procs

Procedural web framework designed for AI agents. The key building blocks are **functions** and **types**. No classes, no frameworks, no magic — just procedures, explicit parameters, and flat file structure that an agent can navigate by `ls`.

- Each function and each type goes in its own file.
- File naming convention: `<module>_<functionName>.ts`. A directory listing is the full inventory.
  - Functions: `<module>_<functionName>.ts`
  - Views: `<module>_view_<name>.tsx`
  - Types: `<module>_type_<typeName>.ts`
  - Generated (DB): `<module>_db_<function>.ts` — auto-generated from schema. Never edit.
  - UI pages: `http_<path>.tsx` — always GET, returns layout + HTML
  - API endpoints: `api_<path>_<METHOD>.tsx` — method at the end (POST, PUT, DELETE)
  - Barrel: `<module>.ts` — re-exports all module functions
  - Names should be self-descriptive so you can understand what it does without opening the file.

## Navigating the codebase with `ls`

The flat file structure means `ls` is your primary navigation tool:

```sh
ls *.ts *.tsx                  # everything
ls issues_*.ts                 # all issue functions and types
ls *_view_*.tsx                # all views
ls *_type_*.ts                 # all types
ls *_db_*.ts                   # all generated DB functions
ls http_*.tsx                  # all UI pages
ls api_*.tsx                   # all API endpoints
ls api_*_POST.tsx              # all POST endpoints
ls http_issues*.tsx api_issues*.tsx  # all issue routes
ls *.test.ts *.test.tsx        # all tests
ls auth_*.ts                   # all auth functions
ls session_*.ts                # all session functions
ls comments_*.ts               # all comment functions
```

**Reading the web app from filenames:**
- `ls http_*.tsx api_*.tsx` = full web surface (UI + API)
- `ls *_view_*.tsx` = all UI pages/components
- `ls *_type_*.ts` = domain model
- `ls <module>.ts` = module boundaries (barrels)
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
    - Business logic (session-scoped): `issues_create(ctx, session, {title, body})` — pass session, not userId
    - Business logic (infra-only): `migrations_run(ctx, dir)` — no session needed
    - Layout: `layout_view_page(ctx, session, title, body)` — both ctx and session
    - Views: `issues_view_list(ctx, issues)` — ctx first, then data
    - Views that need session: `some_view(ctx, session, data)` — ctx, session, then data
  - **When to pass session to business functions**: if the function operates on behalf of a user (creates user-owned data, filters by user, checks permissions), it receives `session`. The function reads `session.user.id` internally. This keeps the caller clean and the ownership logic encapsulated.

## Adding a new feature (full cycle)

1. **Migration** — `bun -e "import { migrations_create } from './migrations_create.ts'; await migrations_create('./migrations', 'add-labels')"`
2. **Write SQL** — edit the `.up.sql` and `.down.sql` files
3. **Apply migration** — `bun -e "import { ctx } from './ctx_start.ts'; import { migrations_run } from './migrations.ts'; await migrations_run(ctx, './migrations')"`
4. **Codegen** — `bun -e "import { ctx } from './ctx_start.ts'; import { codegen_run } from './codegen_run.ts'; await codegen_run(ctx, 'labels')"` — generates `_db_` files
5. **Write tests** — `labels.test.ts` (Red)
6. **Write business functions** — `labels_create.ts`, `labels_listByIssue.ts`, etc. (Green)
7. **Write view tests** — `labels_view.test.tsx` (Red)
8. **Write views** — `labels_view_list.tsx`, etc. (Green)
9. **Write routes** — `HTTP_GET_labels.tsx`, `HTTP_POST_labels.tsx`, etc.
10. **Create barrel** — `labels.ts` re-exporting all
11. **Typecheck** — `bun run typecheck`
12. **Restart server** — `tmux kill-session -t "$(basename $PWD)" 2>/dev/null; tmux new-session -d -s "$(basename $PWD)" 'bun --hot server.ts'`
13. **Verify in browser** or via `bun -e`

## Adding a new module (checklist)

```
migrations/<timestamp>-create-<table>.up.sql   — CREATE TABLE
migrations/<timestamp>-create-<table>.down.sql  — DROP TABLE
<module>_db_*.ts                                 — codegen (auto)
<module>.ts                                      — barrel file
<module>_create.ts                               — business logic
<module>_listAll.ts                              — queries with JOINs
<module>_type_<TypeName>.ts                      — custom types (beyond _db_)
<module>_view_list.tsx                           — HTML views
<module>_view_detail.tsx
http_<module>.tsx                                — UI page (GET)
api_<module>_POST.tsx                            — API endpoint
<module>.test.ts                                 — logic tests
<module>_view.test.tsx                           — view tests
```

## Stack docs

Indexes are in `docs/`, full docs in submodules. Read index first, grep full docs when you need details.

| Index | Full docs | What |
|-------|-----------|------|
| [docs/bun.md](docs/bun.md) | `docs/bun_reference/` (330 mdx) | Bun runtime, APIs, prefer built-in over npm |
| [docs/htmx.md](docs/htmx.md) | `docs/htmx_reference/www/content/` (185 md) | htmx attributes, swap, triggers, examples |
| [docs/tailwind.md](docs/tailwind.md) | `docs/tailwind_reference/src/docs/` (192 mdx) | Tailwind CSS utility classes |
| [docs/datastar.md](docs/datastar.md) | `docs/datastar_reference/` (74 examples) | Datastar — reactive signals + SSE for complex UI |

### htmx vs Datastar

**htmx by default** — simple request/response: click → server HTML → swap. Forms, navigation, CRUD.

**Datastar when htmx isn't enough** — reactive client state, real-time updates, complex UI:
- Client-side reactivity (signals, computed values, conditional show/hide)
- Real-time SSE streaming from server
- Two-way data binding on forms
- Complex state management across multiple elements
- Loading indicators tied to request state
- Cascading updates (one change triggers multiple UI updates)

Both can coexist on the same page. htmx uses `hx-*` attributes, Datastar uses `data-*` attributes.

**htmx example** — simple form submit + swap:
```html
<form hx-post="/issues" hx-target="#list" hx-swap="beforeend">
  <input name="title" required />
  <button type="submit">Create</button>
</form>
<div id="list">...</div>
```

**Datastar example** — live search with reactive signals + SSE:
```html
<div data-signals-search="''">
  <input data-bind-search placeholder="Search..." />
  <div data-on-signal-change-search="@get('/issues/search')" data-indicator-fetching>
    <!-- server streams back HTML fragments via SSE -->
  </div>
  <span data-show="$fetching">Loading...</span>
</div>
```

**Datastar example** — toggle UI without server:
```html
<div data-signals-show="false">
  <button data-on-click="$show = !$show">Toggle details</button>
  <div data-show="$show">Hidden content revealed by signal</div>
</div>
```

**When to pick which:**
| Use case | Pick |
|----------|------|
| Form submit → redirect | htmx |
| Click → swap HTML fragment | htmx |
| Live search with debounce | Datastar |
| Show/hide without server | Datastar |
| Real-time updates (SSE) | Datastar |
| Loading spinners | Datastar (`data-indicator`) |
| Two-way form binding | Datastar (`data-bind`) |

## Calling Functions with `bun -e`

Since every function is pure and takes all dependencies as parameters, you can call any function directly from the command line using `bun -e`. Use this to test, debug, and verify functions without a test harness.

```sh
# call db directly
bun -e "import { ctx } from './ctx_start.ts'; console.log(await ctx.db\`SELECT version()\`)"

# infra function (ctx only)
bun -e "import { ctx } from './ctx_start.ts'; import { migrations_status } from './migrations.ts'; await migrations_status(ctx, './migrations')"

# session-scoped function (ctx + session) — build session from db
bun -e "import { ctx } from './ctx_start.ts'; import { session_resolve } from './session_resolve.ts'; import { issues_listAll } from './issues_listAll.ts'; console.log(await issues_listAll(ctx))"

# register a user
bun -e "import { ctx } from './ctx_start.ts'; import { auth_register } from './auth_register.ts'; console.log(await auth_register(ctx, { name: 'Test', email: 'test@test.com', password: 'pass' }))"

# pure function without db
bun -e "import { session_getIdFromRequest } from './session_getIdFromRequest.ts'; console.log(session_getIdFromRequest(new Request('http://x/', { headers: { cookie: 'sid=abc' } })))"
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
- `data-file="issues_view_list"` — source file name (without extension), always on root element of each view function
- `data-view="issue-item"` — identifies a view component
- `data-role="title"` — identifies a semantic element within a view
- `data-action="done"` — identifies an interactive element (button, link)
- `data-status="todo"` — identifies state

Use `test_html.ts` helpers to query HTML with CSS selectors (built on Bun's `HTMLRewriter`, no npm):

```ts
import { queryExists, queryCount, queryTexts, queryAttrs } from "./test_html.ts";

test("renders issue item with author", () => {
  const html = issues_view_item(ctx, issue);
  expect(queryExists(html, '[data-view="issue-item"]')).toBe(true);
  expect(queryTexts(html, '[data-role="title"]')).toEqual(["Bug report"]);
  expect(queryTexts(html, '[data-role="author"]')).toEqual(["Alice"]);
});
```

Helpers: `queryExists(html, sel)`, `queryCount(html, sel)`, `queryTexts(html, sel)`, `queryAttrs(html, sel, attr)`.

Logic tests go in `<module>.test.ts`, view tests in `<module>_view.test.tsx`.

**Don't test `_db_` functions** — they are generated code. Test business logic that wraps them.

**Testing HTTP handlers** — handlers are just functions `(ctx, session, req, params) → string | Response | null`. Call them directly in tests without a running server:
```ts
import api_login_POST from "./api_login_POST.tsx";

test("POST /login redirects on success", async () => {
  const form = new FormData();
  form.set("email", "alice@test.com");
  form.set("password", "pass");
  const req = new Request("http://localhost/login", { method: "POST", body: form });
  const res = await api_login_POST(ctx, null, req);
  expect((res as Response).status).toBe(302);
});
```

Run: `bun run test` (all tests) or `bun test issues.test.ts` (single file).

## Typecheck

Strict TypeScript checking via `bun run typecheck` (runs `tsc --noEmit`). `docs/` excluded from checking.

Run typecheck after changes to catch type errors early. Strict mode is on — `noUncheckedIndexedAccess`, `strict`, etc.

## SQL patterns

Direct SQL via `ctx.db` tagged templates (`Bun.sql`). No ORM.

```ts
// simple query
const rows = await ctx.db`SELECT * FROM issues WHERE status = ${'open'}`;

// insert with returning
const [row] = await ctx.db`INSERT INTO issues (title, body) VALUES (${title}, ${body}) RETURNING *`;

// update
const [updated] = await ctx.db`UPDATE issues SET status = ${'closed'} WHERE id = ${id} RETURNING *`;

// delete
await ctx.db`DELETE FROM comments WHERE id = ${id}`;

// JOIN with alias
const rows = await ctx.db`
  SELECT i.*, u.name as user_name
  FROM issues i
  JOIN users u ON u.id = i.user_id
`;

// LEFT JOIN for optional relations
const rows = await ctx.db`
  SELECT i.*, a.name as assignee_name
  FROM issues i
  LEFT JOIN users a ON a.id = i.assignee_id
`;

// subquery
const rows = await ctx.db`
  SELECT i.*, (SELECT count(*)::int FROM comments c WHERE c.issue_id = i.id) as comment_count
  FROM issues i
`;

// dynamic insert from object (codegen pattern)
const [row] = await ctx.db`INSERT INTO issues ${ctx.db(data)} RETURNING *`;

// null-safe parameter
await ctx.db`UPDATE issues SET assignee_id = ${userId} WHERE id = ${id}`;  // userId can be null
```

Parameterized queries prevent SQL injection. Never use string interpolation for values — always use `${}` inside tagged templates.

## JSX runtime

Custom JSX → HTML string renderer. No React, no virtual DOM.

- `jsx.ts` + `jsx-runtime.ts` + `jsx-dev-runtime.ts` — the runtime
- `tsconfig.json`: `"jsx": "react-jsx"`, `"jsxImportSource": "."`
- Use `className` (not `class`) — JSX convention
- `dangerouslySetInnerHTML={{ __html: htmlString }}` — inject raw HTML (used in layout for body)
- Boolean attributes: `<option selected={condition}>` — renders `selected` or omits
- JSX returns `string`, not React elements — can concatenate, return from functions, test directly

## Error handling

Handlers return `string | Response | null`. Error patterns:

- **Validation errors** — re-render form with error message: `return layout_view_page(ctx, session, "Title", view_form(ctx, "Error message"))`
- **Not found** — return `null` (router sends 404)
- **Redirect** — return `new Response(null, { status: 302, headers: { Location: "/path" } })`
- **DB errors** — let them propagate (Bun returns 500 by default)
- No try/catch around DB queries unless you need specific error handling (e.g. unique constraint)

## Views (SSR)

Server-side HTML rendering via custom JSX runtime (`jsx.ts`). JSX compiles to plain HTML strings — no React, no virtual DOM. Components are pure functions: `(props) → string`.

- File naming: `<module>_view_<name>.tsx` — e.g. `issues_view_list.tsx`, `issues_view_detail.tsx`
- Views take `ctx` as first parameter, then data. Layout takes `(ctx, session, title, body)`
- Use htmx attributes (`hx-get`, `hx-post`, `hx-swap`, `hx-target`) for interactivity
- `tsconfig.json` configured with `jsxImportSource: "."` pointing to local `jsx-runtime.ts`

```tsx
// issues_view_list.tsx — rendering, takes ctx + data, returns HTML string
export function issues_view_list(ctx: Context, issues: IssueWithUser[]): string {
  return (<div>{issues.map((i) => issues_view_item(ctx, i))}</div>);
}

// layout_view_page.tsx — wraps body in full HTML page with nav
export function layout_view_page(ctx: Context, session: Session | null, title: string, body: string): string { ... }
```

**Split logic and rendering.** A page/endpoint is always two functions — one does the logic (query, transform), the other renders HTML. This keeps logic testable without parsing HTML and views dumb.

```tsx
// HTTP_GET_issues.tsx — handler wires logic + view
export default async function(ctx: Context, session: Session, req: Request) {
  const issues = await issues_listAll(ctx);                                     // logic
  return layout_view_page(ctx, session, "Issues", issues_view_page(ctx, issues)); // render
}
```

Views are testable with `bun -e` like any other function:
```sh
bun -e "import { ctx } from './ctx_start.ts'; import { issues_listAll } from './issues_listAll.ts'; console.log(await issues_listAll(ctx))"
```

## Routes

Two kinds of route files. `$param` in filename becomes `:param` in route.

**UI pages** (`http_*.tsx`) — always GET, return full HTML with layout:
```
http_index.tsx                    → GET /
http_issues.tsx                   → GET /issues
http_issues_new.tsx               → GET /issues/new
http_issues_$id.tsx               → GET /issues/:id
http_login.tsx                    → GET /login
```

**API endpoints** (`api_*.tsx`) — method at the end, return Response (redirect, fragment, JSON):
```
api_issues_POST.tsx               → POST /issues
api_issues_$id_close_POST.tsx     → POST /issues/:id/close
api_issues_$id_assign_POST.tsx    → POST /issues/:id/assign
api_login_POST.tsx                → POST /login
api_logout_POST.tsx               → POST /logout
```

Each file exports `(ctx, session, req, params) → string | Response | null`.

`router_buildRoutes.ts` auto-discovers `http_*.tsx` and `api_*.tsx` files.

- `ls http_*.tsx` — all UI pages
- `ls api_*.tsx` — all API endpoints

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

`bun --hot` enables hot reload for code changes. **Restart the server after every change** — hot reload is not always reliable, especially after adding new route files or changing imports:

```sh
# restart (kill + start)
tmux kill-session -t "$(basename $PWD)" 2>/dev/null; tmux new-session -d -s "$(basename $PWD)" 'bun --hot server.ts'
```

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

## UI testing with CDP

Chrome DevTools Protocol for visual verification and UI testing. CDP server runs separately.

```sh
# start CDP server in tmux (once per project, ports configurable)
tmux new-session -d -s "$(basename $PWD)-cdp" 'CDP_PORT=2230 CDP_CHROME_PORT=9223 bun cdp_server.ts'

# navigate
curl localhost:2230/s/app -d '{"method":"Page.navigate","params":{"url":"http://localhost:3000/issues"}}'

# screenshot → file
curl -s localhost:2230/s/app -d '{"method":"Page.captureScreenshot","params":{"format":"png"}}' | jq -r '.data' | base64 -d > /tmp/screen.png

# read element text
curl -s localhost:2230/s/app -d '{"method":"Runtime.evaluate","params":{"expression":"document.querySelector(\"h1\").textContent"}}'

# click element
curl -s localhost:2230/s/app -d '{"method":"Runtime.evaluate","params":{"expression":"document.querySelector(\"[data-action=close]\").click()"}}'

# fill input
curl -s localhost:2230/s/app -d '{"method":"Runtime.evaluate","params":{"expression":"document.querySelector(\"input[name=title]\").value=\"Bug report\""}}'

# get page text
curl -s localhost:2230/s/app -d '{"method":"Runtime.evaluate","params":{"expression":"document.body.innerText"}}'
```

**Session `app`** — reuse for all app testing. CDP keeps cookies between requests (persistent Chrome profile).

**When to use CDP:**
- Visual verification after UI changes (screenshot)
- Test flows that need real browser (login → create issue → comment → close)
- Debug rendering issues
- NOT for unit/logic tests — use `bun test` for those
