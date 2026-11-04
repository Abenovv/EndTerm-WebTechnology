const { test } = require("node:test");
const assert = require("node:assert/strict");
const S = require("../js/data.js");
const now = new Date(2026, 10, 4, 20);
test("Yerkebulan: empty search results and totals are valid", () => {
  assert.deepEqual(S.filterSessions("not-a-real-session"), []);
  assert.equal(S.total([], "minutes"), 0);
});
test("Yerkebulan: eight community activities have correct total", () => {
  assert.equal(S.activities.length, 8);
  assert.equal(S.total(S.activities, "minutes"), 260);
});

for (const [name, value, type] of [
  ["name", " ", "preferences"],
  ["email", "x@x", "preferences"],
  ["minutes", "16", "preferences"],
  ["game", "fake", "preferences"],
  ["consent", false, "preferences"],
]) {
  test(`yerkebulan: rejects ${name}: ${value}`, () =>
    assert.notEqual(S.validate(name, value, type, now), ""));
}
test("Yerkebulan: optional message may be empty", () =>
  assert.equal(S.validate("message", "", "preferences", now), ""));
