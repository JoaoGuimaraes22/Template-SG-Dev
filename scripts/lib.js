#!/usr/bin/env node
// launchkit — Shared script helpers
// Used by setup.js, config.js, extract.js, reset.js, validate.js, status.js

const fs = require("fs");
const path = require("path");

// Absolute path to the launchkit tool root (one level above scripts/)
const TOOL_ROOT = path.resolve(__dirname, "..");

// Schema version for .launchkit files. Bump when the format changes.
const LAUNCHKIT_VERSION = 1;

// Supported locales — single source of truth. First entry is the default/fallback.
const LOCALES = ["pt", "en"];
const DEFAULT_LOCALE = LOCALES[0];

// Dictionary file paths derived from LOCALES.
const DICT_FILES = LOCALES.map((l) => `dictionaries/${l}.json`);

// TypeScript literal for generated sitemap files.
const LOCALES_TS_LITERAL = `[${LOCALES.map((l) => `"${l}"`).join(", ")}] as const`;

// Target project directory — defaults to TOOL_ROOT, set via setTarget()
let _target = TOOL_ROOT;

function setTarget(absPath) {
  _target = absPath;
}

function target() {
  return _target;
}

// ── File operations (all resolve against _target for project paths) ──────────

// Deletes a file or directory (recursively) if it exists. No-op otherwise.
function deleteIfExists(relPath) {
  const full = path.join(_target, relPath);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true, force: true });
    console.log("  [removed]", relPath);
  }
}

// Recursively copies srcRel (from TOOL_ROOT) → destRel (in _target), logging each file.
// Throws if source is missing unless { optional: true } is passed.
function copyDir(srcRel, destRel, { optional = false } = {}) {
  const src = path.join(TOOL_ROOT, srcRel);
  const dest = path.join(_target, destRel);
  if (!fs.existsSync(src)) {
    if (optional) return;
    throw new Error(`copyDir: source directory not found: ${srcRel}`);
  }
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

// Copies a single file from TOOL_ROOT/srcRel → _target/destRel.
// Creates parent directories as needed. Throws if source is missing unless { optional: true }.
function copyFile(srcRel, destRel, { optional = false } = {}) {
  const src = path.join(TOOL_ROOT, srcRel);
  const dest = path.join(_target, destRel);
  if (!fs.existsSync(src)) {
    if (optional) { console.warn("  [warn] source not found:", srcRel); return; }
    throw new Error(`copyFile: source not found: ${srcRel}`);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log("  [copied]", srcRel, "→", destRel);
}

// Copies a file within the target project (both paths relative to _target).
function copyFileInProject(srcRel, destRel) {
  const src = path.join(_target, srcRel);
  const dest = path.join(_target, destRel);
  if (!fs.existsSync(src)) {
    console.warn("  [warn] source not found:", srcRel);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log("  [moved] ", srcRel, "→", destRel);
}

// Copies a directory within the target project (both paths relative to _target).
function copyDirInProject(srcRel, destRel) {
  const src = path.join(_target, srcRel);
  const dest = path.join(_target, destRel);
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const srcEntry = path.join(src, entry);
    const destEntry = path.join(dest, entry);
    if (fs.statSync(srcEntry).isDirectory()) {
      copyDirInProject(path.join(srcRel, entry), path.join(destRel, entry));
    } else {
      fs.copyFileSync(srcEntry, destEntry);
      console.log("  [moved] ", path.join(srcRel, entry), "→", path.join(destRel, entry));
    }
  }
}

// Verifies that a file or directory exists at relPath (in _target). Throws if missing.
// Used after copy operations to confirm the copy succeeded before deleting the source.
function assertExists(relPath) {
  const full = path.join(_target, relPath);
  if (!fs.existsSync(full)) {
    throw new Error(`Expected ${relPath} to exist after copy, but it was not found. Aborting to prevent data loss.`);
  }
}

// ── Marker-based content utilities ───────────────────────────────────────────

// Extracts content between two marker strings in `content` (startMarker inclusive,
// endMarker exclusive). Returns null if either marker is absent or start >= end.
function extractBetweenMarkers(content, startMarker, endMarker) {
  const s = content.indexOf(startMarker);
  const e = content.indexOf(endMarker);
  if (s === -1 || e === -1 || s >= e) return null;
  return content.slice(s, e);
}

// In a file at relPath (relative to _target), removes all content from startMarker
// up to (but not including) endMarker. Also trims the preceding newline to avoid
// leaving a blank line. Returns true if the block was removed, false otherwise.
function removeMarkerBlock(relPath, startMarker, endMarker) {
  const full = path.join(_target, relPath);
  if (!fs.existsSync(full)) return false;
  let content = fs.readFileSync(full, "utf8");
  const s = content.indexOf(startMarker);
  const e = content.indexOf(endMarker);
  if (s === -1 || e === -1 || s >= e) return false;
  // Trim a preceding newline so we don't leave a blank line
  const trimFrom = s > 0 && content[s - 1] === "\n" ? s - 1 : s;
  content = content.slice(0, trimFrom) + content.slice(e);
  fs.writeFileSync(full, content, "utf8");
  console.log("  [patched]", relPath, "— removed marker block:", startMarker.trim());
  return true;
}

// Removes every line that contains `substring` from a file. No-op if file is missing.
function removeLineContaining(relPath, substring) {
  const full = path.join(_target, relPath);
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
// Returns true if a replacement was made, false otherwise. Warns when the search string wasn't found.
function replaceInFile(relPath, searchStr, replaceStr) {
  const full = path.join(_target, relPath);
  if (!fs.existsSync(full)) return false;
  const original = fs.readFileSync(full, "utf8");
  const updated = original.split(searchStr).join(replaceStr);
  if (updated !== original) {
    fs.writeFileSync(full, updated, "utf8");
    console.log("  [patched]", relPath);
    return true;
  }
  console.warn("  [warn] replaceInFile: search string not found in", relPath);
  return false;
}

// Adds depName@version to package.json dependencies if not already present.
function addDependency(depName, version) {
  const pkgPath = path.join(_target, "package.json");
  const pkg = safeJsonParse(fs.readFileSync(pkgPath, "utf8"), "package.json");
  if (!pkg.dependencies) pkg.dependencies = {};
  if (!pkg.dependencies[depName]) {
    pkg.dependencies[depName] = version;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
    console.log("  [patched] package.json — added dependency:", depName, version);
  }
}

// Removes depName from package.json dependencies if present.
function removeDependency(depName) {
  const pkgPath = path.join(_target, "package.json");
  const pkg = safeJsonParse(fs.readFileSync(pkgPath, "utf8"), "package.json");
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

// ── Safe JSON parse ──────────────────────────────────────────────────────────

// Parses JSON with an actionable error message on failure.
// `label` describes the file for the error message (e.g. "dictionaries/en.json").
function safeJsonParse(raw, label) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse ${label}: ${err.message}`);
  }
}

// Reads and parses a JSON file relative to _target. Throws with a clear message on failure.
function readJsonFile(relPath) {
  const full = path.join(_target, relPath);
  const raw = fs.readFileSync(full, "utf8");
  return safeJsonParse(raw, relPath);
}

// ── .launchkit I/O ────────────────────────────────────────────────────────────

function readLaunchkit() {
  const p = path.join(_target, ".launchkit");
  if (!fs.existsSync(p)) {
    console.error("\n  Error: .launchkit not found at", _target);
    console.error("  Run node scripts/setup.js first.\n");
    process.exit(1);
  }
  const state = safeJsonParse(fs.readFileSync(p, "utf8"), ".launchkit");
  // Validate required fields
  if (!state.type) {
    console.error("\n  Error: .launchkit is missing required field (type).");
    console.error("  The file may be corrupted. Run reset + setup to regenerate.\n");
    process.exit(1);
  }
  // Ensure features exists (backward compat)
  if (!state.features) state.features = {};
  // Backward compat: migrate old i18n boolean to languages key
  if (state.features.languages === undefined) {
    state.features.languages = state.features.i18n === false ? "en" : "en+pt";
  }
  // Version migration: stamp version if missing (pre-v1 files), warn if newer
  if (state.version === undefined) {
    state.version = LAUNCHKIT_VERSION;
    writeLaunchkit(state);
    console.log("  [migrated] .launchkit — added version field (v1)");
  } else if (state.version > LAUNCHKIT_VERSION) {
    console.error(`\n  Error: .launchkit version ${state.version} is newer than this tool (v${LAUNCHKIT_VERSION}).`);
    console.error("  Update launchkit to the latest version.\n");
    process.exit(1);
  }
  return state;
}

// Writes .launchkit atomically: write to a temp file, then rename.
// Automatically stamps the current LAUNCHKIT_VERSION.
function writeLaunchkit(state) {
  state.version = LAUNCHKIT_VERSION;
  const dest = path.join(_target, ".launchkit");
  const tmp = dest + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2) + "\n", "utf8");
  fs.renameSync(tmp, dest);
}

// ── Template file copy ────────────────────────────────────────────────────────

// Copies app/, dictionaries/, public/ from a template into the target project.
// Dialogflow (portfolio-only) must be copied separately by the template module.
function copyTemplateFiles(type) {
  copyDir(`templates/presets/${type}/app`, "app");
  copyDir(`templates/presets/${type}/dictionaries`, "dictionaries");
  copyDir(`templates/presets/${type}/public`, "public");
  copyFile(`templates/presets/${type}/BOOTSTRAP.md`, "BOOTSTRAP.md", { optional: true });
}

// Copies base scaffold (package.json, tsconfig, configs, base app/) into the target project.
function copyBaseScaffold() {
  copyDir("templates/presets/base", ".");
}

// ── --help flag ──────────────────────────────────────────────────────────────

// Prints usage text and exits if --help or -h is present in argv.
function checkHelp(usage) {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(usage);
    process.exit(0);
  }
}

// ── Template autodiscovery ────────────────────────────────────────────────────

// Scans scripts/templates/ at runtime and returns { key: module } for each .js
// file that exports the required interface (type, setup).
// Caches after first call. Replaces the hardcoded TEMPLATES maps in setup/toggle/status.
let _templateCache = null;

function loadTemplates() {
  if (_templateCache) return _templateCache;
  const templatesDir = path.join(__dirname, "templates");
  const entries = fs.readdirSync(templatesDir).filter((f) => f.endsWith(".js"));
  _templateCache = {};
  for (const file of entries) {
    const mod = require(path.join(templatesDir, file));
    const key = path.basename(file, ".js");
    // Validate required interface
    const missing = ["type", "setup"]
      .filter((fn) => mod[fn] === undefined);
    if (missing.length > 0) {
      console.warn(`  [warn] templates/${file} missing exports: ${missing.join(", ")} — skipped`);
      continue;
    }
    _templateCache[key] = mod;
  }
  return _templateCache;
}

// ── Setup config discovery ────────────────────────────────────────────────────

let _setupConfigCache = null;

// Scans configs/setup/[name]/ for setup-time config definitions.
// Returns [{ ...meta, hooks: { apply? } }].
function loadSetupConfigs() {
  if (_setupConfigCache) return _setupConfigCache;
  const root = path.join(TOOL_ROOT, "configs", "setup");
  if (!fs.existsSync(root)) return (_setupConfigCache = []);
  const configs = [];
  for (const name of fs.readdirSync(root)) {
    const dir = path.join(root, name);
    if (!fs.statSync(dir).isDirectory()) continue;
    const metaPath = path.join(dir, "meta.json");
    if (!fs.existsSync(metaPath)) continue;
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    const hooksPath = path.join(dir, "hooks.js");
    const hooks = fs.existsSync(hooksPath) ? require(hooksPath) : {};
    configs.push({ ...meta, hooks });
  }
  return (_setupConfigCache = configs);
}

// ── --project flag parser ─────────────────────────────────────────────────────

// Call from scripts that operate on an existing project.
// Reads --project <path> from argv. Falls back to cwd.
function parseProjectFlag() {
  const idx = process.argv.indexOf("--project");
  if (idx !== -1 && process.argv[idx + 1]) {
    return path.resolve(process.argv[idx + 1]);
  }
  return process.cwd();
}

module.exports = {
  TOOL_ROOT,
  LAUNCHKIT_VERSION,
  LOCALES,
  DEFAULT_LOCALE,
  DICT_FILES,
  LOCALES_TS_LITERAL,
  setTarget,
  target,
  deleteIfExists,
  copyDir,
  copyFile,
  copyFileInProject,
  copyDirInProject,
  extractBetweenMarkers,
  removeMarkerBlock,
  removeLineContaining,
  replaceInFile,
  addDependency,
  removeDependency,
  safeJsonParse,
  readJsonFile,
  assertExists,
  ask,
  askChoice,
  readLaunchkit,
  writeLaunchkit,
  copyTemplateFiles,
  copyBaseScaffold,
  parseProjectFlag,
  checkHelp,
  loadTemplates,
  loadSetupConfigs,
};
