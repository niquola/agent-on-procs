# htmx

Server returns HTML fragments, htmx swaps them into the page — no JS needed.

## Core attributes

- `hx-get="/url"`, `hx-post`, `hx-put`, `hx-delete` — HTTP request on event
- `hx-target="#id"` — where to put the response (`this`, `closest tr`, `find .class`, `next`, `previous`)
- `hx-swap="innerHTML"` — how to swap: `innerHTML`, `outerHTML`, `beforeend`, `afterbegin`, `delete`, `none`
- `hx-trigger="click"` — when to fire: `click`, `change`, `keyup`, `submit`, `load`, `revealed`, `every 2s`
- `hx-indicator="#spinner"` — show element during request
- `hx-confirm="Sure?"` — confirmation dialog before request
- `hx-vals='{"key":"val"}'` — extra JSON values with request
- `hx-include="#other-form"` — include inputs from another element
- `hx-push-url="true"` — update browser URL

## Trigger modifiers

`hx-trigger="keyup changed delay:500ms"`, `hx-trigger="click throttle:1s"`

## Response headers from server

- `HX-Trigger: eventName` — trigger client event after swap
- `HX-Redirect: /url` — full redirect
- `HX-Retarget: #other` — change target
- `HX-Reswap: outerHTML` — change swap strategy

## How htmx fits procedural style

- htmx requests hit `HTTP_*.tsx` route handlers
- Route handler calls logic function to get data
- Then calls view function to render HTML fragment
- htmx swaps that fragment into the page
- No JSON serialization, no client-side rendering, no JS state management
- Full pages return layout + view, htmx partials return just the view fragment
- Everything is testable without a browser — view functions return strings
