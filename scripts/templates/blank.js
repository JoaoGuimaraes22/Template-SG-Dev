#!/usr/bin/env node
// launchkit — Blank template module
// Owns: template file copy + i18n collapse logic.
// i18n feature toggle is prompted and applied by setup.js via configs/setup/i18n/.

const {
  copyDirInProject,
  copyFileInProject,
  copyTemplateFiles,
  deleteIfExists,
  SECONDARY_DICT_FILES,
} = require("../lib");

const TYPE = "blank";

// ── i18n collapse (app/[locale]/ → app/) ─────────────────────────────────────

function collapseI18n() {
  console.log("\n─── Collapsing i18n routing (app/[locale]/ → app/) ─────────────\n");
  copyDirInProject("app/[locale]/components", "app/components");
  copyFileInProject("app/[locale]/layout.tsx", "app/layout.tsx");
  copyFileInProject("app/[locale]/page.tsx", "app/page.tsx");
  deleteIfExists("app/[locale]");
  for (const f of SECONDARY_DICT_FILES) deleteIfExists(f);
  console.log("\n✓  i18n routing collapsed — app/ is now locale-free");
}

// ── Template file copy ────────────────────────────────────────────────────────

async function setup() {
  console.log(`\n─── Copying blank template ─────────────────────────────────────────\n`);
  copyTemplateFiles(TYPE);
  return { type: TYPE, sections: {} };
}

module.exports = { type: TYPE, setup, collapseI18n };
