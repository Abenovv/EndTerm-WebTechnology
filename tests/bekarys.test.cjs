const { test } = require("node:test");
const assert = require("node:assert/strict");
const S = require("../js/data.js");
const now = new Date(2026, 10, 4, 20);
test("Bekarys: roadmap has eight tasks and 50 estimated hours", () => {
  assert.equal(S.tasks.length, 8);
  assert.equal(S.total(S.tasks, "hours"), 50);
});
test("Bekarys: Code collaboration at 5h/week needs 4 weeks", () =>
  assert.equal(
    Math.ceil(
      S.total(
        S.tasks.filter((t) => t.discipline === "Code"),
        "hours",
      ) / 5,
    ),
    4,
  ));

for (const [name, value, type] of [
  ["hours", "0", "collaboration"],
  ["message", "short", "collaboration"],
]) {
  test(`bekarys: rejects ${name}: ${value}`, () =>
    assert.notEqual(S.validate(name, value, type, now), ""));
}
