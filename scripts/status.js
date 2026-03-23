#!/usr/bin/env node
// launchkit — Status
// Read-only: prints .launchkit type, project config, and component files.
// Run: node scripts/status.js --project ../my-project

const fs = require("fs");
const path = require("path");
const { target, setTarget, parseProjectFlag, readLaunchkit, checkHelp } = require("./lib");

checkHelp(`
launchkit — Status

  Read-only display of template type, project config, and components.

Usage:
  node scripts/status.js [--project <path>]

Options:
  --project <path>    Path to the generated project (default: cwd)
  -h, --help          Show this help message

Examples:
  node scripts/status.js --project ../my-site
`);

// ── Resolve target project ───────────────────────────────────────────────────
setTarget(parseProjectFlag());

const state       = readLaunchkit();
const { type }    = state;
const i18nActive  = fs.existsSync(path.join(target(), "i18n-config.ts"));
const compDir     = i18nActive ? "app/[locale]/components" : "app/components";

console.log("\n╔══════════════════════════════════════════╗");
console.log("║        launchkit — Status                ║");
console.log("╚══════════════════════════════════════════╝\n");

console.log(`  Template : ${type.charAt(0).toUpperCase() + type.slice(1)}`);
console.log(`  Project  : ${target()}`);
console.log(`  i18n     : ${i18nActive ? "enabled" : "disabled"}`);
if (state.features?.accentColor) {
  console.log(`  Accent   : ${state.features.accentColor}`);
}
if (state.features?.languages) {
  console.log(`  Languages: ${state.features.languages}`);
}
if (state.features?.deployUrl) {
  console.log(`  Deploy   : ${state.features.deployUrl}`);
}
if (state.sourceTemplate) {
  console.log(`  Source   : ${state.sourceTemplate}`);
}

// ── Components ──────────────────────────────────────────────────────────────

const absCompDir = path.join(target(), compDir);
if (fs.existsSync(absCompDir)) {
  const components = fs.readdirSync(absCompDir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(".tsx", ""));

  if (components.length > 0) {
    console.log(`\n  Components (${components.length}):`);
    for (const comp of components) {
      console.log(`    ${comp}`);
    }
  }
}

console.log();
