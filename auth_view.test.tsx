import { test, expect } from "bun:test";
import { pageState } from "./cdp_pageState.ts";
import { queryExists, queryTexts } from "./test_html.ts";
import { auth_view_login } from "./auth_view_login.tsx";

test("auth_view_login page state", () => {
  const html = auth_view_login();
  const state = pageState(html);
  expect(state.page).toBe("login");
  expect(state.forms[0]!.name).toBe("login");
  expect(state.forms[0]!.fields.map((f) => f.name)).toEqual(["email", "password"]);
  expect(state.actions.map((a) => a.action)).toContain("login");
});

test("auth_view_login renders error", () => {
  const html = auth_view_login("Bad credentials");
  expect(queryExists(html, '[data-role="error"]')).toBe(true);
  expect(queryTexts(html, '[data-role="error"]')).toEqual(["Bad credentials"]);
});

test("auth_view_login no error by default", () => {
  const html = auth_view_login();
  expect(queryExists(html, '[data-role="error"]')).toBe(false);
});
