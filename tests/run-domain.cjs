const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const files = fs
  .readdirSync(__dirname)
  .filter((name) => name.endsWith(".test.cjs") && name !== "browser.test.cjs")
  .map((name) => path.join(__dirname, name));
const result = spawnSync(process.execPath, ["--test", ...files], {
  stdio: "inherit",
});
process.exitCode = result.status ?? 1;
