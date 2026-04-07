# Bun

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
