// Extract page state via data-* attributes — for CDP UI testing and bun test HTML assertions.
// CDP: curl -s localhost:2230/s/app -d "$(bun cdp_pageState.ts)" | jq -r '.result.value' | jq .
// Tests: import { pageState } from "./cdp_pageState.ts"; const state = pageState(html);

const PAGE_STATE_JS = `({
  page: document.querySelector("[data-page]")?.dataset.page || null,
  url: location.pathname,
  title: document.title,
  entities: [...document.querySelectorAll("[data-entity]")].map(el => ({
    type: el.dataset.entity,
    id: el.dataset.id || null,
    status: el.dataset.status || null,
    fields: Object.fromEntries(
      [...el.querySelectorAll("[data-role]")].map(r => [r.dataset.role, r.innerText.trim()])
    ),
    href: el.tagName === "A" ? el.getAttribute("href") : null
  })),
  actions: [...document.querySelectorAll("[data-action]")].map(el => ({
    action: el.dataset.action,
    text: el.innerText.trim().slice(0, 50),
    selector: '[data-action="' + el.dataset.action + '"]'
  })),
  forms: [...document.querySelectorAll("[data-form]")].map(f => {
    const form = f.closest("form") || f;
    return {
      name: f.dataset.form,
      action: form.action ? new URL(form.action).pathname : null,
      fields: [...form.querySelectorAll("input,textarea,select")].map(i => i.name).filter(Boolean)
    };
  }),
  nav: [...new Set([...document.querySelectorAll("a[href^='/']")].map(a => a.getAttribute("href")))]
})`;

// For CDP usage
if (typeof Bun !== "undefined" && process.argv[1]?.endsWith("cdp_pageState.ts")) {
  console.log(JSON.stringify({
    method: "Runtime.evaluate",
    params: { expression: `JSON.stringify(${PAGE_STATE_JS}, null, 2)` }
  }));
}

// For bun test usage — parse HTML string into page state
export function pageState(html: string): {
  page: string | null;
  entities: { type: string; id: string | null; status: string | null; fields: Record<string, string>; href: string | null }[];
  actions: { action: string; text: string; selector: string }[];
  forms: { name: string; fields: string[] }[];
  nav: string[];
} {
  const result: any = { page: null, entities: [], actions: [], forms: [], nav: [] };

  const rewriter = new HTMLRewriter();

  // page
  rewriter.on("[data-page]", { element(el) { result.page = el.getAttribute("data-page"); } });

  // entities — collect with nested roles
  let currentEntity: any = null;
  rewriter.on("[data-entity]", {
    element(el) {
      currentEntity = {
        type: el.getAttribute("data-entity"),
        id: el.getAttribute("data-id"),
        status: el.getAttribute("data-status"),
        fields: {},
        href: el.tagName === "a" ? el.getAttribute("href") : null,
      };
      result.entities.push(currentEntity);
    }
  });
  rewriter.on("[data-entity] [data-role]", {
    element(el) { if (currentEntity) currentEntity._currentRole = el.getAttribute("data-role"); },
    text(t) { if (currentEntity?._currentRole) { currentEntity.fields[currentEntity._currentRole] = (currentEntity.fields[currentEntity._currentRole] || "") + t.text; } },
  });

  // actions
  rewriter.on("[data-action]", {
    element(el) {
      const action = el.getAttribute("data-action")!;
      result.actions.push({ action, text: "", selector: `[data-action="${action}"]` });
      result._currentAction = result.actions.length - 1;
    },
    text(t) { if (result._currentAction !== undefined) result.actions[result._currentAction].text += t.text; },
  });

  // forms
  rewriter.on("[data-form]", {
    element(el) {
      result.forms.push({ name: el.getAttribute("data-form"), fields: [] });
      result._currentForm = result.forms.length - 1;
    }
  });
  rewriter.on("[data-form] input[name], [data-form] textarea[name], [data-form] select[name]", {
    element(el) {
      const name = el.getAttribute("name");
      if (name && result._currentForm !== undefined) result.forms[result._currentForm].fields.push(name);
    }
  });

  // nav links
  rewriter.on("a[href^='/']", {
    element(el) {
      const href = el.getAttribute("href");
      if (href && !result.nav.includes(href)) result.nav.push(href);
    }
  });

  rewriter.transform(new Response(html));

  // cleanup
  for (const e of result.entities) delete e._currentRole;
  delete result._currentAction;
  delete result._currentForm;

  return result;
}
