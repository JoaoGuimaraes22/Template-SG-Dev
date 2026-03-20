#!/usr/bin/env node
// launchkit — Validate Script
// Checks for unreplaced YOUR_* placeholders and TODO: TEMPLATE comments.
// Run: node scripts/validate.js  (or: npm run validate)

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// Directories to scan
const SCAN_DIRS = ["app", "dictionaries"];

// Dirs/files to skip while walking
const SKIP = new Set([".next", "node_modules", ".git", "scripts"]);

// ── Feature detection ────────────────────────────────────────────────────────

const i18nActive = fs.existsSync(path.join(ROOT, "i18n-config.ts"));
const localeSeg = i18nActive ? "[locale]" : "";
const componentsDir = ["app", localeSeg, "components"].filter(Boolean).join("/");

function componentExists(name) {
  return fs.existsSync(path.join(ROOT, componentsDir, name));
}

const isPortfolio = componentExists("ProfileSidebar.tsx");
const isBusiness = componentExists("Footer.tsx");
const templateName = isPortfolio ? "portfolio" : isBusiness ? "business site" : "unknown";

// ── File walker ──────────────────────────────────────────────────────────────

function walkFiles(dir, results = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, results);
    } else {
      results.push(full);
    }
  }
  return results;
}

// ── Scan ─────────────────────────────────────────────────────────────────────

const placeholderHits = []; // { rel, line, match }
const todoHits = [];        // { rel, line, match }

const PLACEHOLDER_RE = /YOUR_[A-Z_]+/g;
const TODO_RE = /\/\/\s*TODO:\s*TEMPLATE/;

for (const scanDir of SCAN_DIRS) {
  const absDir = path.join(ROOT, scanDir);
  if (!fs.existsSync(absDir)) continue;

  for (const filePath of walkFiles(absDir)) {
    let content;
    try {
      content = fs.readFileSync(filePath, "utf8");
    } catch {
      continue;
    }
    const rel = path.relative(ROOT, filePath).replace(/\\/g, "/");
    const lines = content.split("\n");

    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;

      // Placeholders
      let m;
      PLACEHOLDER_RE.lastIndex = 0;
      while ((m = PLACEHOLDER_RE.exec(lineText)) !== null) {
        placeholderHits.push({ rel, line: lineNum, match: m[0] });
      }

      // TODO comments
      if (TODO_RE.test(lineText)) {
        todoHits.push({ rel, line: lineNum, match: lineText.trim() });
      }
    });
  }
}

// ── Report ───────────────────────────────────────────────────────────────────

const envExists = fs.existsSync(path.join(ROOT, ".env.local"));

console.log();
console.log(
  `  [validate] launchkit — ${templateName} template, i18n ${i18nActive ? "enabled" : "disabled"}`
);
console.log(`  [check]    Scanning ${SCAN_DIRS.join(", ")} ...`);
console.log();

let failed = false;

// Placeholders
if (placeholderHits.length === 0) {
  console.log("  [ok]    No unreplaced placeholders found");
} else {
  failed = true;
  console.log(`  [error] ${placeholderHits.length} unreplaced placeholder(s) found:`);
  for (const { rel, line, match } of placeholderHits) {
    const loc = `${rel}:${line}`.padEnd(60);
    console.log(`            ${loc} ${match}`);
  }
}

console.log();

// TODOs
if (todoHits.length === 0) {
  console.log("  [ok]    No TODO: TEMPLATE comments found");
} else {
  failed = true;
  console.log(`  [warn]  ${todoHits.length} TODO: TEMPLATE comment(s) found:`);
  for (const { rel, line, match } of todoHits) {
    const loc = `${rel}:${line}`.padEnd(60);
    console.log(`            ${loc} ${match}`);
  }
}

console.log();

// .env.local
if (envExists) {
  console.log("  [ok]    .env.local exists");
} else {
  console.log("  [warn]  .env.local not found — create it from .env.example before deploying");
}

console.log();

if (failed) {
  console.log("  ✗  Validation failed — fix the above before deploying.\n");
  process.exit(1);
} else {
  console.log("  ✓  All checks passed.\n");
}
