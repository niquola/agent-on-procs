// Extract page state via data-* attributes — for CDP UI testing without screenshots.
// Usage: curl -s localhost:2230/s/app -d "$(bun cdp_pageState.ts)" | jq -r '.result.value' | jq .

const expression = `JSON.stringify({
  url: location.pathname,
  title: document.title,
  views: [...document.querySelectorAll("[data-view]")].map(el => ({
    view: el.dataset.view,
    status: el.dataset.status || undefined,
    text: el.innerText.trim().slice(0, 100)
  })),
  actions: [...document.querySelectorAll("[data-action]")].map(el => ({
    action: el.dataset.action,
    tag: el.tagName,
    text: el.innerText.trim().slice(0, 50)
  })),
  roles: [...document.querySelectorAll("[data-role]")].map(el => ({
    role: el.dataset.role,
    text: el.innerText.trim().slice(0, 80)
  })),
  forms: [...document.querySelectorAll("form")].map(f => ({
    action: new URL(f.action).pathname,
    inputs: [...f.querySelectorAll("input,textarea,select")].map(i => i.name).filter(Boolean)
  })),
  links: [...document.querySelectorAll("a[href]")].map(a => ({
    href: a.getAttribute("href"),
    text: a.innerText.trim().slice(0, 50)
  }))
}, null, 2)`;

console.log(JSON.stringify({ method: "Runtime.evaluate", params: { expression } }));
