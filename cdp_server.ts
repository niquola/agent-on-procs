#!/usr/bin/env bun

const HTTP_PORT = process.env.CDP_PORT || 2229;
const BROWSER_URL = "http://127.0.0.1:9222";
const DEBUG_PORT = 9222;
const SESSION_TTL = 5 * 60 * 1000; // 5 minutes
const USER_DATA_DIR = `${import.meta.dir}/../chrome-profile`;

// Sessions: name -> { ws, targetId, lastUsed, msgId, pending }
const sessions = new Map();
let chromeProcess = null;

function getChromePath() {
  if (process.platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  } else if (process.platform === "win32") {
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  }
  return "google-chrome";
}

async function startChrome() {
  const chromePath = getChromePath();
  process.stderr.write(`Starting Chrome with debugging port ${DEBUG_PORT}...\n`);

  chromeProcess = Bun.spawn([chromePath, `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${USER_DATA_DIR}`], {
    stdout: "ignore",
    stderr: "ignore",
  });

  for (let i = 0; i < 30; i++) {
    await Bun.sleep(200);
    try {
      const res = await fetch(`${BROWSER_URL}/json/version`);
      if (res.ok) {
        process.stderr.write(`Chrome started successfully\n`);
        return true;
      }
    } catch {}
  }
  throw new Error("Failed to start Chrome");
}

async function ensureBrowserRunning() {
  try {
    const res = await fetch(`${BROWSER_URL}/json/version`);
    return res.ok;
  } catch {
    return await startChrome();
  }
}

async function createSession(name) {
  await ensureBrowserRunning();

  // Create new tab (Chrome requires PUT method)
  const target = await fetch(`${BROWSER_URL}/json/new`, { method: "PUT" }).then(r => r.json());

  return new Promise((resolve, reject) => {
    const socket = new WebSocket(target.webSocketDebuggerUrl);
    const session = {
      ws: socket,
      targetId: target.id,
      lastUsed: Date.now(),
      msgId: 0,
      pending: new Map(),
    };

    socket.onopen = () => {
      sessions.set(name, session);
      process.stderr.write(`Session '${name}' created (tab: ${target.id})\n`);
      resolve(session);
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.id && session.pending.has(data.id)) {
        session.pending.get(data.id)(data);
        session.pending.delete(data.id);
      }
    };

    socket.onerror = reject;
    socket.onclose = () => {
      sessions.delete(name);
      process.stderr.write(`Session '${name}' closed\n`);
    };
  });
}

async function getSession(name) {
  let session = sessions.get(name);
  if (!session || session.ws.readyState !== WebSocket.OPEN) {
    session = await createSession(name);
  }
  session.lastUsed = Date.now();
  return session;
}

async function closeSession(name) {
  const session = sessions.get(name);
  if (!session) return false;

  try {
    // Close the tab
    await fetch(`${BROWSER_URL}/json/close/${session.targetId}`);
    session.ws.close();
  } catch {}

  sessions.delete(name);
  return true;
}

async function cdp(session, method, params = {}) {
  const id = ++session.msgId;
  return new Promise(resolve => {
    session.pending.set(id, resolve);
    session.ws.send(JSON.stringify({ id, method, params }));
  });
}

// Cleanup expired sessions every minute
setInterval(() => {
  const now = Date.now();
  for (const [name, session] of sessions) {
    if (now - session.lastUsed > SESSION_TTL) {
      process.stderr.write(`Session '${name}' expired (idle > 5min)\n`);
      closeSession(name);
    }
  }
}, 60 * 1000);

// ============ REST API ============

const server = Bun.serve({
  port: HTTP_PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // POST /s/:name - send CDP command
    if (req.method === "POST" && path.startsWith("/s/")) {
      const name = decodeURIComponent(path.slice(3));
      if (!name) return Response.json({ error: "Session name required" }, { status: 400 });

      try {
        const { method, params = {} } = await req.json();
        const session = await getSession(name);
        const { result, error } = await cdp(session, method, params);
        if (error) return Response.json({ error: error.message }, { status: 400 });
        return Response.json(result);
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
      }
    }

    // DELETE /s/:name - close session
    if (req.method === "DELETE" && path.startsWith("/s/")) {
      const name = decodeURIComponent(path.slice(3));
      const closed = await closeSession(name);
      return Response.json({ ok: closed });
    }

    // GET /sessions - list sessions
    if (path === "/sessions") {
      const list = [];
      for (const [name, session] of sessions) {
        list.push({
          name,
          targetId: session.targetId,
          idleMs: Date.now() - session.lastUsed,
          connected: session.ws.readyState === WebSocket.OPEN,
        });
      }
      return Response.json(list);
    }

    // GET /health
    if (path === "/health") {
      return Response.json({ ok: true, sessions: sessions.size });
    }

    return Response.json({
      error: "Not found",
      usage: {
        "POST /s/:name": "Send CDP command (auto-creates session)",
        "DELETE /s/:name": "Close session",
        "GET /sessions": "List active sessions",
        "GET /health": "Health check",
      }
    }, { status: 404 });
  },
});

process.stderr.write(`CDP server running on http://localhost:${HTTP_PORT}\n`);
process.stderr.write(`Sessions auto-close after 5 minutes of inactivity\n`);
