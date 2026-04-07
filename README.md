# Agent on Procs

Opinionated template project for procedural agentic web development.

No classes, no frameworks, no ORM, no magic. Just procedures, types, SQL, and HTML strings. Optimized for AI agents to read, write, and navigate.

## Stack

- **Bun** — runtime, server, test runner, package manager
- **PostgreSQL** — database (via `Bun.sql`)
- **htmx** — interactivity without JS (default)
- **Datastar** — reactive signals + SSE for complex UI
- **Tailwind CSS** — styling via CDN
- **Custom JSX** — SSR to HTML strings, no React
- **CDP** — Chrome DevTools Protocol for UI testing

## Key Ideas

- **One file = one function.** `ls *.ts *.tsx` is the full inventory
- **Explicit parameters.** `fn(ctx, session, data)` — no hidden state, no DI
- **ctx** = shared infrastructure (db), **session** = per-request identity (user)
- **Procedures all the way.** Business logic, views, handlers — all plain functions
- **File naming is documentation.** `issues_create.ts`, `http_issues.tsx`, `api_issues_POST.tsx`
- **data-* attributes** — every view is annotated for agent interaction and testing
- **Codegen from DB.** `_db_` files auto-generated from schema, never edited
- **TDD.** Tests before implementation. Red, green, refactor.
- **UI components.** `<UI_Button>`, `<UI_Input>`, `<UI_Select>` — reusable JSX tags with data-* baked in

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

# run tests & typecheck
bun run test
bun run typecheck
```

## File Naming

| Pattern | Example | Purpose |
|---------|---------|---------|
| `<module>_<fn>.ts` | `issues_create.ts` | Business function |
| `<module>_view_<name>.tsx` | `issues_view_detail.tsx` | View (SSR HTML) |
| `<module>_type_<Name>.ts` | `issues_type_IssueWithUser.ts` | Type definition |
| `<module>_db_<fn>.ts` | `issues_db_create.ts` | Generated CRUD (don't edit) |
| `http_<path>.tsx` | `http_issues.tsx` | UI page (GET) |
| `api_<path>_<METHOD>.tsx` | `api_issues_POST.tsx` | API endpoint |
| `UI_<Name>.tsx` | `UI_Button.tsx` | Reusable UI component |
| `<module>.ts` | `issues.ts` | Barrel (re-exports) |
| `<module>.test.ts` | `issues.test.ts` | Tests |

## Navigate with `ls`

```sh
ls *.ts *.tsx              # everything
ls http_*.tsx              # all UI pages
ls api_*.tsx               # all API endpoints
ls issues_*.ts             # all issue functions
ls UI_*.tsx                # all UI components
ls *_db_*.ts               # all generated DB functions
ls *.test.ts *.test.tsx    # all tests
```

## data-* Attribute Language

Every view is annotated for agents and tests:

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-page` | Page identity | `issues-list`, `issue-detail`, `login` |
| `data-entity` | Entity type | `issue`, `comment`, `user` |
| `data-id` | Entity ID | uuid |
| `data-status` | Entity state | `open`, `closed` |
| `data-role` | Semantic field | `title`, `author`, `comment-body` |
| `data-action` | Clickable action | `close`, `reopen`, `comment` |
| `data-form` | Named form | `create-issue`, `add-comment`, `login` |

`__pageState()` is injected into every page — returns structured JSON with entities, actions, forms (including select options), and navigation links.

## UI Testing with CDP

```sh
# start CDP server
tmux new-session -d -s cdp 'CDP_PORT=2230 CDP_CHROME_PORT=9223 bun cdp_server.ts'
```

```ts
import { cdp } from './cdp.ts';

await cdp.navigate('/issues');
const state = await cdp.pageState();   // { page, entities[], actions[], forms[], nav[] }
await cdp.click('[data-action=close]');
await cdp.fill('[data-form=add-comment] textarea[name=body]', 'Fixed!');
await cdp.submit('[data-form=add-comment]');
await cdp.select('[data-form=assign] select[name=assignee_id]', userId);
await cdp.screenshot('/tmp/screen.png');
```

## Call Any Function from CLI

```bash
bun -e "import { ctx } from './ctx_start.ts'; console.log(await ctx.db\`SELECT count(*) FROM issues\`)"
bun -e "import { cdp } from './cdp.ts'; await cdp.navigate('/issues'); console.log(await cdp.pageState())"
```

## Docs

| Index | Full docs | What |
|-------|-----------|------|
| `docs/bun.md` | `docs/bun_reference/` | Bun runtime & APIs |
| `docs/htmx.md` | `docs/htmx_reference/` | htmx attributes & examples |
| `docs/tailwind.md` | `docs/tailwind_reference/` | Tailwind CSS utilities |
| `docs/datastar.md` | `docs/datastar_reference/` | Datastar signals & SSE |

## Why "Agent on Procs"?

**Agent** — the code is written by AI agents. Flat structure, self-describing filenames, `ls` = full map, `bun -e` = instant verification, `pageState()` = structured UI interaction.

**on Procs** — procedures are the only building block. Like PostgreSQL stored procedures, but in TypeScript. No abstractions to learn, no patterns to follow — just functions that take params and return results.
