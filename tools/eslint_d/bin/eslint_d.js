#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import process from "node:process";
import { createRequire } from "node:module";

const args = process.argv.slice(2);
const command = args[0];

// Provide a compatible surface for tools that expect eslint_d's lifecycle commands.
if (command === "start" || command === "stop" || command === "restart" || command === "status") {
  process.exit(0);
}

const require = createRequire(import.meta.url);

let eslintBin;
try {
  eslintBin = require.resolve("eslint/bin/eslint.js");
} catch {
  console.error("eslint_d: Could not resolve local eslint. Did you install dependencies?");
  process.exit(1);
}

const result = spawnSync(process.execPath, [eslintBin, ...args], { stdio: "inherit" });
process.exit(result.status ?? 1);
