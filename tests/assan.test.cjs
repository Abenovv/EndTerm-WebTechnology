const { test } = require("node:test");
const assert = require("node:assert/strict");
const S = require("../js/data.js");
const now = new Date(2026, 10, 4, 20);
test("Assan: catalogue has eight complete unique records", () => {
  assert.equal(S.sessions.length, 8);
  assert.equal(new Set(S.sessions.map((s) => s.id)).size, 8);
  assert.ok(
    S.sessions.every(
      (s) => Object.keys(s).length >= 4 && s.minutes > 0 && s.title && s.world,
    ),
  );
});
test("Assan: search ignores case and surrounding spaces", () =>
  assert.equal(S.filterSessions("  VALLEY  ").length, 2));
test("Assan: genre combines with search", () =>
  assert.equal(S.filterSessions("valley", "cozy").length, 0));
test("Assan: sorting preserves the original collection", () => {
  const original = JSON.stringify(S.sessions);
  assert.equal(S.filterSessions("", "all", "short")[0].minutes, 20);
  assert.equal(S.filterSessions("", "all", "long")[0].minutes, 60);
  assert.equal(JSON.stringify(S.sessions), original);
});
test("Assan: expedition adds photo and lore stops", () =>
  assert.equal(S.expeditionMinutes("emberwake", true, true), 55));
test("Assan: unknown routes fail explicitly", () =>
  assert.throws(() => S.expeditionMinutes("missing", false, false), /valid/));

for (const [name, value, type] of [
  ["phone", "123", "booking"],
  ["people", "7", "booking"],
  ["people", "1.5", "booking"],
  ["date", "2026-11-03", "booking"],
  ["date", "2026-02-30", "booking"],
  ["date", "2027-11-05", "booking"],
]) {
  test(`assan: rejects ${name}: ${value}`, () =>
    assert.notEqual(S.validate(name, value, type, now), ""));
}
test("Assan: accepts dates at both permitted boundaries", () => {
  for (const value of ["2026-11-04", "2027-11-04"])
    assert.equal(S.validate("date", value, "booking", now), "");
});
