---
name: bun
description: Bun runtime, bundler, test runner, and package manager. Use when writing Bun scripts, HTTP servers, working with files, SQLite, SQL, S3, shell, WebSocket, or any Bun-specific API.
allowed-tools: Bash(bun -e *, bun run *, bun test *, bun install *, bun add *, bun remove *, bun build *, bun init *), Read, Grep, Glob
---

# Bun

Fast JavaScript/TypeScript runtime with built-in bundler, test runner, and package manager.

**Prefer native Bun APIs over npm packages.** Bun has built-in support for HTTP servers, SQLite, PostgreSQL, Redis, S3, file I/O, hashing, shell, WebSockets, glob, semver, TOML/YAML/JSON5/JSONL parsing, compression, cookies, CSRF, cron, and more. Check the index below before reaching for a third-party package.

Full documentation is at `~/.claude/skills/bun/reference/` (330 MDX files from official Bun docs). Search with Grep/Glob when you need details.

## Native Built-in Index

### Networking & Servers
| API | What it does | Docs |
|-----|-------------|------|
| `Bun.serve()` | HTTP/HTTPS server (Request/Response) | `~/.claude/skills/bun/reference/runtime/http/server.mdx` |
| `Bun.serve()` + `websocket` | WebSocket server | `~/.claude/skills/bun/reference/runtime/http/websockets.mdx` |
| `fetch()` | HTTP client (Web standard) | `~/.claude/skills/bun/reference/runtime/networking/fetch.mdx` |
| `Bun.listen()` / `Bun.connect()` | Raw TCP sockets | `~/.claude/skills/bun/reference/runtime/networking/tcp.mdx` |
| `Bun.udpSocket()` | UDP sockets | `~/.claude/skills/bun/reference/runtime/networking/udp.mdx` |
| `Bun.dns` | DNS lookup, prefetch, cache | `~/.claude/skills/bun/reference/runtime/networking/dns.mdx` |

### Databases & Storage (no npm needed!)
| API | What it does | Docs |
|-----|-------------|------|
| `bun:sqlite` | SQLite — built into runtime | `~/.claude/skills/bun/reference/runtime/sqlite.mdx` |
| `Bun.SQL` / `Bun.sql` | PostgreSQL client | `~/.claude/skills/bun/reference/runtime/sql.mdx` |
| `Bun.RedisClient` / `Bun.redis` | Redis/Valkey client | `~/.claude/skills/bun/reference/runtime/redis.mdx` |
| `Bun.s3()` | S3-compatible object storage | `~/.claude/skills/bun/reference/runtime/s3.mdx` |

### File System
| API | What it does | Docs |
|-----|-------------|------|
| `Bun.file()` | Lazy file reference (BunFile → Blob) | `~/.claude/skills/bun/reference/runtime/file-io.mdx` |
| `Bun.write()` | Fast file writing | `~/.claude/skills/bun/reference/runtime/file-io.mdx` |
| `Bun.stdin/stdout/stderr` | Standard I/O as BunFile | `~/.claude/skills/bun/reference/runtime/file-io.mdx` |
| `Bun.Glob` | Glob pattern matching | `~/.claude/skills/bun/reference/runtime/glob.mdx` |

### Shell & Processes
| API | What it does | Docs |
|-----|-------------|------|
| `$` (tagged template) | Shell scripting — pipes, env, globs | `~/.claude/skills/bun/reference/runtime/shell.mdx` |
| `Bun.spawn()` / `Bun.spawnSync()` | Child processes | `~/.claude/skills/bun/reference/runtime/child-process.mdx` |

### Crypto & Hashing
| API | What it does | Docs |
|-----|-------------|------|
| `Bun.hash()` | Fast non-crypto hash (wyhash) | `~/.claude/skills/bun/reference/runtime/hashing.mdx` |
| `Bun.CryptoHasher` | SHA-256/512, MD5, etc. | `~/.claude/skills/bun/reference/runtime/hashing.mdx` |
| `Bun.password.hash/verify` | bcrypt/argon2 password hashing | `~/.claude/skills/bun/reference/runtime/hashing.mdx` |
| `Bun.CSRF` | CSRF token generate/verify | `~/.claude/skills/bun/reference/runtime/csrf.mdx` |

### Parsing & Formats (no npm needed!)
| API | What it does | Docs |
|-----|-------------|------|
| `Bun.TOML.parse` | TOML parser | `~/.claude/skills/bun/reference/runtime/toml.mdx` |
| native import | YAML import/parse | `~/.claude/skills/bun/reference/runtime/yaml.mdx` |
| native import | JSON5 import/parse | `~/.claude/skills/bun/reference/runtime/json5.mdx` |
| native import | JSONL streaming | `~/.claude/skills/bun/reference/runtime/jsonl.mdx` |
| `Bun.markdown` | Markdown → HTML | `~/.claude/skills/bun/reference/runtime/markdown.mdx` |
| `Bun.semver` | Semver comparison | `~/.claude/skills/bun/reference/runtime/semver.mdx` |
| `Bun.color` | CSS color parsing | `~/.claude/skills/bun/reference/runtime/color.mdx` |

### Compression
| API | What it does |
|-----|-------------|
| `Bun.gzipSync()` / `Bun.gunzipSync()` | gzip |
| `Bun.deflateSync()` / `Bun.inflateSync()` | deflate |
| `Bun.zstdCompress()` / `Bun.zstdDecompress()` | zstd |

### Web & HTML
| API | What it does | Docs |
|-----|-------------|------|
| `HTMLRewriter` | Streaming HTML transform | `~/.claude/skills/bun/reference/runtime/html-rewriter.mdx` |
| `Bun.Cookie` / `Bun.CookieMap` | Cookie parsing | `~/.claude/skills/bun/reference/runtime/cookies.mdx` |
| `Bun.escapeHTML()` | HTML entity escaping | `~/.claude/skills/bun/reference/runtime/utils.mdx` |

### Testing (no Jest/Vitest needed!)
| API | What it does | Docs |
|-----|-------------|------|
| `bun:test` | Test runner — describe/test/expect | `~/.claude/skills/bun/reference/test/writing-tests.mdx` |
| mocks | `mock()`, `spyOn()` | `~/.claude/skills/bun/reference/test/mocks.mdx` |
| snapshots | `toMatchSnapshot()` | `~/.claude/skills/bun/reference/test/snapshots.mdx` |
| DOM | happy-dom integration | `~/.claude/skills/bun/reference/test/dom.mdx` |

### Other Built-ins
| API | What it does | Docs |
|-----|-------------|------|
| `Bun.cron()` | Cron scheduler | `~/.claude/skills/bun/reference/runtime/cron.mdx` |
| `Bun.serve()` static | Static file serving | `~/.claude/skills/bun/reference/runtime/http/server.mdx` |
| `Bun.FileSystemRouter` | File-based routing | `~/.claude/skills/bun/reference/runtime/file-system-router.mdx` |
| `bun:ffi` | Call C/Rust/Zig from JS | `~/.claude/skills/bun/reference/runtime/ffi.mdx` |
| `Bun.Transpiler` | JS/TS transpiler API | `~/.claude/skills/bun/reference/runtime/transpiler.mdx` |
| `Worker` | Multi-threading | `~/.claude/skills/bun/reference/runtime/workers.mdx` |
| `Bun.plugin()` | Module loader plugins | `~/.claude/skills/bun/reference/runtime/plugins.mdx` |
| `Bun.build()` | Bundler API | `~/.claude/skills/bun/reference/bundler/index.mdx` |
| `Bun.secrets` | Secret/env management | `~/.claude/skills/bun/reference/runtime/secrets.mdx` |
| `Bun.archive` | Archive (tar) support | `~/.claude/skills/bun/reference/runtime/archive.mdx` |
| `Bun.sleep()` / `Bun.nanoseconds()` | Timing | `~/.claude/skills/bun/reference/runtime/utils.mdx` |
| `Bun.randomUUIDv7()` | UUID generation | `~/.claude/skills/bun/reference/runtime/utils.mdx` |
| `Bun.deepEquals()` / `Bun.deepMatch()` | Deep comparison | `~/.claude/skills/bun/reference/runtime/utils.mdx` |
| `Bun.inspect()` | Pretty-print objects | `~/.claude/skills/bun/reference/runtime/utils.mdx` |

## CLI Commands

| Command | What it does | Docs |
|---------|-------------|------|
| `bun run script.ts` | Run a TS/JS file | `~/.claude/skills/bun/reference/runtime/index.mdx` |
| `bun -e 'code'` | Eval one-liner | |
| `bun test` | Run tests | `~/.claude/skills/bun/reference/test/index.mdx` |
| `bun test --watch` | Tests in watch mode | |
| `bun build ./src/index.ts` | Bundle | `~/.claude/skills/bun/reference/bundler/index.mdx` |
| `bun build --compile` | Compile to standalone binary | `~/.claude/skills/bun/reference/bundler/executables.mdx` |
| `bun install` | Install deps (fast!) | `~/.claude/skills/bun/reference/pm/cli/install.mdx` |
| `bun add <pkg>` | Add dependency | `~/.claude/skills/bun/reference/pm/cli/add.mdx` |
| `bun remove <pkg>` | Remove dependency | `~/.claude/skills/bun/reference/pm/cli/remove.mdx` |
| `bun update` | Update deps | `~/.claude/skills/bun/reference/pm/cli/update.mdx` |
| `bun outdated` | Check outdated deps | `~/.claude/skills/bun/reference/pm/cli/outdated.mdx` |
| `bun audit` | Security audit | `~/.claude/skills/bun/reference/pm/cli/audit.mdx` |
| `bunx <pkg>` | Run package bin (like npx) | `~/.claude/skills/bun/reference/pm/bunx.mdx` |
| `bun init` | Init new project | `~/.claude/skills/bun/reference/runtime/templating/init.mdx` |
| `bun --watch script.ts` | Run with auto-reload | `~/.claude/skills/bun/reference/runtime/watch-mode.mdx` |
| `bun --hot script.ts` | Hot reload (keep state) | `~/.claude/skills/bun/reference/bundler/hot-reloading.mdx` |
| `bun repl` | Interactive REPL | `~/.claude/skills/bun/reference/runtime/repl.mdx` |

## Config: `bunfig.toml`

Project config goes in `bunfig.toml`. Docs: `~/.claude/skills/bun/reference/runtime/bunfig.mdx`

## Reference Lookup

When you need API details, search the local reference:

```
Grep pattern="Bun\.serve" path="~/.claude/skills/bun/reference/" glob="*.mdx"
Grep pattern="SQLite|sqlite" path="~/.claude/skills/bun/reference/" glob="*.mdx"
Glob pattern="~/.claude/skills/bun/reference/runtime/*.mdx"
```

## Tips

- **Always prefer Bun built-ins** — don't `bun add better-sqlite3` when `bun:sqlite` exists, don't add `express` when `Bun.serve()` works, don't add `glob` when `Bun.Glob` is built-in
- Bun natively runs TypeScript — no `tsc` or build step needed
- `Bun.file()` is lazy — no disk read until `.text()`, `.json()`, etc.
- `Bun.write()` accepts strings, Blobs, ArrayBuffers, Response, BunFile
- `Bun.serve()` uses Web standard Request/Response
- Shell `$` returns a Response-like — use `.text()`, `.json()`, `.lines()`
- `bun:test` is Jest-compatible — same `describe/test/expect` API
- When unsure about an API, search `~/.claude/skills/bun/reference/` — it has the full official docs
