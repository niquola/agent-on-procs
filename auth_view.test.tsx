import { test, expect } from "bun:test";
import { queryExists, queryTexts } from "./test_html.ts";
import { auth_view_login } from "./auth_view_login.tsx";

test("auth_view_login renders form", () => {
  const html = auth_view_login();
  expect(queryExists(html, '[data-file="auth_view_login"]')).toBe(true);
  expect(queryExists(html, 'input[name="email"]')).toBe(true);
  expect(queryExists(html, 'input[name="password"]')).toBe(true);
  expect(queryExists(html, '[data-action="login"]')).toBe(true);
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
