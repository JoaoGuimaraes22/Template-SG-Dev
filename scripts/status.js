#!/usr/bin/env node
// launchkit — Status
// Read-only: prints .launchkit type + current feature state. No prompts, no changes.
// Run: npm run status

const fs = require("fs");
const path = require("path");
const { ROOT, readLaunchkit } = require("./lib");

const TEMPLATES = {
  portfolio: require("./templates/portfolio"),
  business:  require("./templates/business"),
  blank:     require("./templates/blank"),
};

const state       = readLaunchkit();
const { type }    = state;
const tmpl        = TEMPLATES[type] ?? TEMPLATES.blank;
const i18nActive  = fs.existsSync(path.join(ROOT, "i18n-config.ts"));
const compDir     = i18nActive ? "app/[locale]/components" : "app/components";

console.log("\n╔══════════════════════════════════════════╗");
console.log("║        launchkit — Status                ║");
console.log("╚══════════════════════════════════════════╝\n");

console.log(`  Template : ${type.charAt(0).toUpperCase() + type.slice(1)}`);
console.log(`  i18n     : ${i18nActive ? "enabled" : "disabled (collapsed)"}\n`);

const current = tmpl.detectState(compDir);

for (const f of tmpl.featureList) {
  const active   = current[f.key];
  const recorded = state.features?.[f.key];
  const drift    = recorded !== undefined && recorded !== active ? " ⚠ drift" : "";

  let icon;
  if (f.unsupported) icon = "⚠ ";
  else if (f.recolor) icon = "● ";
  else icon = active ? "✓ " : "✗ ";

  const suffix = f.recolor ? ` (current: ${state.features?.accentColor ?? "indigo"})` : drift;
  console.log(`  ${icon} ${f.label}${suffix}`);
}

const hasDrift = tmpl.featureList.some(
  (f) => !f.unsupported && !f.recolor &&
         state.features?.[f.key] !== undefined &&
         state.features[f.key] !== current[f.key]
);

if (hasDrift) {
  console.log("\n  ⚠  .launchkit is out of sync with actual file state.");
  console.log("     Run npm run toggle to reconcile, or npm run reset + setup.\n");
} else {
  console.log();
}
