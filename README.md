# Agent on Procs

Opinionated template project for procedural agentic web development.

No classes, no frameworks, no ORM, no magic. Just procedures, types, SQL, and HTML strings. Optimized for AI agents to read, write, and navigate.

## Stack

- **Bun** — runtime, server, test runner, package manager
- **PostgreSQL** — database (via `Bun.sql`)
- **htmx** — interactivity without JS
- **Tailwind CSS** — styling via CDN
- **Custom JSX** — SSR to HTML strings, no React

## Key Ideas

- **One file = one function.** `ls *.ts *.tsx` is the full API inventory
- **Explicit parameters.** `fn(ctx, session, data)` — no hidden state, no DI, no singletons
- **ctx** = shared infrastructure (db), **session** = per-request identity (user)
- **Procedures all the way.** Business logic, views, handlers — all plain functions
- **File naming is documentation.** `issues_create.ts`, `HTTP_POST_issues.tsx`, `issues_view_detail.tsx`
- **Codegen from DB.** `_db_` files auto-generated from `information_schema`, never edited
- **TDD.** Tests before implementation. Red, green, refactor.

## Quick Start

```bash
# install
bun install

# setup .env
echo "PGHOST=localhost
PGPORT=5432
PGDATABASE=agent_on_procs
PGUSER=postgres
PGPASSWORD=postgres" > .env

# create database
createdb agent_on_procs

# run migrations
bun -e "import { ctx } from './ctx_start.ts'; import { migrations_run } from './migrations.ts'; await migrations_run(ctx, './migrations')"

# start server
bun --hot server.ts

# run tests
bun test
```

## Structure

```
ctx.ts                          — Context type (db connection)
ctx_start.ts                    — builds ctx from env
server.ts                       — Bun.serve() + router
router_buildRoutes.ts           — auto-discovers HTTP_*.tsx files
auth_guard.ts                   — session check, redirect to /login
layout_view_page.tsx            — HTML shell with nav

HTTP_GET_issues.tsx             — GET /issues (list)
HTTP_POST_issues.tsx            — POST /issues (create)
HTTP_GET_issues_$id.tsx         — GET /issues/:id (detail)
HTTP_POST_issues_$id_close.tsx  — POST /issues/:id/close
...

issues_create.ts                — business logic
issues_listAll.ts               — query with JOIN
issues_view_list.tsx            — HTML rendering
issues_view_detail.tsx          — HTML rendering
issues_type_IssueWithUser.ts    — type definition

issues_db_create.ts             — generated CRUD (don't edit)
issues_db_list.ts               — generated
...

migrations/                     — SQL up/down files
```

## Conventions

| Pattern | Example |
|---|---|
| Function | `issues_create.ts` |
| View | `issues_view_detail.tsx` |
| Type | `issues_type_IssueWithUser.ts` |
| Generated DB | `issues_db_create.ts` |
| Route | `HTTP_POST_issues_$id_close.tsx` |
| Test | `issues.test.ts`, `issues_view.test.tsx` |
| Barrel | `issues.ts` |

## Call any function from CLI

```bash
# db query
bun -e "import { ctx } from './ctx_start.ts'; console.log(await ctx.db\`SELECT count(*) FROM issues\`)"

# business function
bun -e "import { ctx } from './ctx_start.ts'; import { issues_listAll } from './issues_listAll.ts'; console.log(await issues_listAll(ctx))"

# register a user
bun -e "import { ctx } from './ctx_start.ts'; import { auth_register } from './auth_register.ts'; console.log(await auth_register(ctx, { name: 'Alice', email: 'alice@test.com', password: 'pass' }))"
```

## Why "Agent on Procs"?

**Agent** — the code is written by AI agents. Flat structure, self-describing filenames, `ls` = full map, `bun -e` = instant verification. Everything is optimized for agent workflow.

**on Procs** — procedures are the only building block. Like PostgreSQL stored procedures, but in TypeScript. No abstractions to learn, no patterns to follow — just functions that take params and return results.
