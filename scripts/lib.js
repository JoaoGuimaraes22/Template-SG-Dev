#!/usr/bin/env node
// launchkit — Shared script helpers
// Used by setup.js, toggle.js, and reset.js

const fs = require("fs");
const path = require("path");

// Absolute path to the repo root (one level above scripts/)
const ROOT = path.resolve(__dirname, "..");

// Deletes a file or directory (recursively) if it exists. No-op otherwise.
function deleteIfExists(relPath) {
  const full = path.join(ROOT, relPath);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true, force: true });
    console.log("  [removed]", relPath);
  }
}

// Recursively copies srcRel → destRel, logging each file. Skips missing sources.
function copyDir(srcRel, destRel) {
  const src = path.join(ROOT, srcRel);
  const dest = path.join(ROOT, destRel);
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const srcEntry = path.join(src, entry);
    const destEntry = path.join(dest, entry);
    if (fs.statSync(srcEntry).isDirectory()) {
      copyDir(path.join(srcRel, entry), path.join(destRel, entry));
    } else {
      fs.copyFileSync(srcEntry, destEntry);
      console.log("  [copied]", path.join(srcRel, entry), "→", path.join(destRel, entry));
    }
  }
}

// Copies a single file, creating parent directories as needed. Warns if source is missing.
function copyFile(srcRel, destRel) {
  const src = path.join(ROOT, srcRel);
  const dest = path.join(ROOT, destRel);
  if (!fs.existsSync(src)) {
    console.warn("  [warn] source not found:", srcRel);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log("  [copied]", srcRel, "→", destRel);
}

// Removes every line that contains `substring` from a file. No-op if file is missing.
function removeLineContaining(relPath, substring) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return;
  const original = fs.readFileSync(full, "utf8");
  const filtered = original
    .split("\n")
    .filter((line) => !line.includes(substring))
    .join("\n");
  if (filtered !== original) {
    fs.writeFileSync(full, filtered, "utf8");
    console.log("  [patched]", relPath, "— removed line containing:", substring.trim());
  }
}

// Replaces all occurrences of searchStr with replaceStr in a file. No-op if file is missing.
function replaceInFile(relPath, searchStr, replaceStr) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return;
  const original = fs.readFileSync(full, "utf8");
  const updated = original.split(searchStr).join(replaceStr);
  if (updated !== original) {
    fs.writeFileSync(full, updated, "utf8");
    console.log("  [patched]", relPath);
  }
}

// Adds depName@version to package.json dependencies if not already present.
function addDependency(depName, version) {
  const pkgPath = path.join(ROOT, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  if (!pkg.dependencies) pkg.dependencies = {};
  if (!pkg.dependencies[depName]) {
    pkg.dependencies[depName] = version;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
    console.log("  [patched] package.json — added dependency:", depName, version);
  }
}

// Removes depName from package.json dependencies if present.
function removeDependency(depName) {
  const pkgPath = path.join(ROOT, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  if (pkg.dependencies && pkg.dependencies[depName]) {
    delete pkg.dependencies[depName];
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
    console.log("  [patched] package.json — removed dependency:", depName);
  }
}

// ── readline helpers ──────────────────────────────────────────────────────────

// Prompts a y/n question. Returns true for "y".
function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question + " [y/n] ", (answer) => {
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

// Displays a numbered list and returns the 1-based choice index, or null for invalid input.
function askChoice(rl, question, choices) {
  return new Promise((resolve) => {
    console.log(question);
    choices.forEach((c, i) => console.log(`  [${i + 1}] ${c}`));
    rl.question("Enter choice: ", (answer) => {
      const n = parseInt(answer.trim(), 10);
      resolve(n >= 1 && n <= choices.length ? n : null);
    });
  });
}

// ── .launchkit I/O ────────────────────────────────────────────────────────────

function readLaunchkit() {
  const p = path.join(ROOT, ".launchkit");
  if (!fs.existsSync(p)) {
    console.error("\n  Error: .launchkit not found.\n  Run node scripts/setup.js first.\n");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeLaunchkit(state) {
  fs.writeFileSync(path.join(ROOT, ".launchkit"), JSON.stringify(state, null, 2) + "\n", "utf8");
}

// ── Template file copy ────────────────────────────────────────────────────────

// Copies app/, dictionaries/, public/ from a template into the project root.
// Dialogflow (portfolio-only) must be copied separately by the template module.
function copyTemplateFiles(type) {
  copyDir(`templates/${type}/app`, "app");
  copyDir(`templates/${type}/dictionaries`, "dictionaries");
  copyDir(`templates/${type}/public`, "public");
}

module.exports = {
  ROOT,
  deleteIfExists,
  copyDir,
  copyFile,
  removeLineContaining,
  replaceInFile,
  addDependency,
  removeDependency,
  ask,
  askChoice,
  readLaunchkit,
  writeLaunchkit,
  copyTemplateFiles,
};
