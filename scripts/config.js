#!/usr/bin/env node
// launchkit — Project Config
// Manages project-wide settings: i18n status display, accent color recolor.
// Run: node scripts/config.js --project ../my-project

const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { target, setTarget, parseProjectFlag, readLaunchkit, writeLaunchkit, askChoice, checkHelp, loadTemplates } = require("./lib");

checkHelp(`
launchkit — Config

  View and update project-wide settings (i18n, accent color).

Usage:
  node scripts/config.js [--project <path>]

Options:
  --project <path>    Path to the generated project (default: cwd)
  -h, --help          Show this help message

Examples:
  node scripts/config.js --project ../my-site
  cd ../my-site && node ../launchkit/scripts/config.js
`);

// ── Resolve target project ───────────────────────────────────────────────────
setTarget(parseProjectFlag());

const TEMPLATES = loadTemplates();

async function main() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║        launchkit — Config                ║");
  console.log("╚══════════════════════════════════════════╝");

  const state = readLaunchkit();
  const { type } = state;
  const tmpl = TEMPLATES[type];

  const i18nActive = fs.existsSync(path.join(target(), "i18n-config.ts"));
  const compDir = i18nActive ? "app/[locale]/components" : "app/components";
  const layoutFile = i18nActive ? "app/[locale]/layout.tsx" : "app/layout.tsx";

  const currentColor = state.features?.accentColor ?? "indigo";

  console.log(`\n  Template : ${type.charAt(0).toUpperCase() + type.slice(1)}`);
  console.log(`  Project  : ${target()}`);
  console.log(`  i18n     : ${i18nActive ? "enabled" : "disabled"}`);
  console.log(`  Accent   : ${currentColor}`);

  if (!tmpl || !tmpl.recolor) {
    console.log("\n  No configurable settings for this template.\n");
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    const colorChoice = await askChoice(rl, `\n  Current color: ${currentColor}\n  Select new accent color:`, tmpl.COLOR_LABELS);
    if (!colorChoice) { console.log("\n  Cancelled.\n"); return; }
    const toColor = tmpl.COLOR_MAP[colorChoice - 1];
    if (toColor === currentColor) {
      console.log("\n  No change — same color selected.\n");
      return;
    }
    console.log(`\n─── Recoloring: ${currentColor} → ${toColor} ────────────────────────────────────\n`);
    tmpl.recolor(currentColor, toColor, compDir, layoutFile);
    state.features.accentColor = toColor;
    writeLaunchkit(state);
    console.log(`\n  Accent color updated: ${currentColor} → ${toColor}.`);
    console.log("  Run npm run dev to preview.\n");
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error("Config failed:", err);
  process.exit(1);
});
