#!/usr/bin/env node
// launchkit — Extract Template
// Takes a finished Next.js project and extracts a reusable template from it.
// Run: node scripts/extract.js --source ../gutsy --name restaurant

const fs = require("fs");
const path = require("path");
const { TOOL_ROOT, checkHelp } = require("./lib");

checkHelp(`
launchkit — Extract Template

  Extracts a reusable template from an existing Next.js project.
  The extracted template can then be used with setup.js to create new projects.

Usage:
  node scripts/extract.js --source <path> --name <template-name> [options]

Options:
  --source <path>     Path to the source project (required)
  --name <name>       Template name (required, e.g. "restaurant")
  --force             Overwrite existing template with the same name
  --skip-images       Skip copying public/ images (create placeholders instead)
  -h, --help          Show this help message

Examples:
  node scripts/extract.js --source ../gutsy --name restaurant
  node scripts/extract.js --source ../gutsy --name restaurant --force
`);

// ── Parse flags ─────────────────────────────────────────────────────────────

function parseFlag(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1] && !process.argv[idx + 1].startsWith("--")) {
    return process.argv[idx + 1];
  }
  return null;
}

const sourcePath = parseFlag("--source");
const templateName = parseFlag("--name");
const force = process.argv.includes("--force");
const skipImages = process.argv.includes("--skip-images");

if (!sourcePath || !templateName) {
  console.error("\n  Error: --source and --name are required.");
  console.error("  Usage: node scripts/extract.js --source ../my-site --name my-template\n");
  process.exit(1);
}

// Validate template name
const INVALID_CHARS = /[^a-z0-9-]/;
if (INVALID_CHARS.test(templateName)) {
  console.error("\n  Error: template name must be lowercase alphanumeric with hyphens only.\n");
  process.exit(1);
}

const absSource = path.resolve(sourcePath);
const templateDir = path.join(TOOL_ROOT, "templates", "presets", templateName);
const templateModulePath = path.join(TOOL_ROOT, "scripts", "templates", `${templateName}.js`);

// ── Base scaffold files (will be excluded from extraction) ──────────────────

const BASE_DIR = path.join(TOOL_ROOT, "templates", "presets", "base");

// Relative paths of base scaffold files — these are NOT template-specific
function getBaseFiles() {
  const files = new Set();
  function walk(dir, rel) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), entryRel);
      } else {
        files.add(entryRel);
      }
    }
  }
  walk(BASE_DIR, "");
  return files;
}

// ── Accent color detection ──────────────────────────────────────────────────

const TAILWIND_COLORS = [
  "slate", "gray", "zinc", "neutral", "stone",
  "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal",
  "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose",
];
const NEUTRAL_COLORS = new Set(["slate", "gray", "zinc", "neutral", "stone", "white", "black"]);

function detectAccentColor(files) {
  const colorCounts = {};
  const COLOR_RE = /\b(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(\d{2,3})\b/g;

  for (const filePath of files) {
    if (!filePath.endsWith(".tsx") && !filePath.endsWith(".ts")) continue;
    let content;
    try { content = fs.readFileSync(filePath, "utf8"); } catch { continue; }
    let m;
    while ((m = COLOR_RE.exec(content)) !== null) {
      const color = m[1];
      if (NEUTRAL_COLORS.has(color)) continue;
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    }
  }

  // Return the most frequently used non-neutral color
  let maxColor = "indigo";
  let maxCount = 0;
  for (const [color, count] of Object.entries(colorCounts)) {
    if (count > maxCount) {
      maxColor = color;
      maxCount = count;
    }
  }
  return maxColor;
}

// ── File copy helpers ───────────────────────────────────────────────────────

function copyRecursive(src, dest, { skipSet = new Set(), stats = { files: 0, dirs: 0 } } = {}) {
  if (!fs.existsSync(src)) return stats;
  fs.mkdirSync(dest, { recursive: true });
  stats.dirs++;

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules, .next, .git
      if ([".next", "node_modules", ".git"].includes(entry.name)) continue;
      copyRecursive(srcPath, destPath, { skipSet, stats });
    } else {
      if (skipSet.has(entry.name)) continue;
      fs.copyFileSync(srcPath, destPath);
      stats.files++;
    }
  }
  return stats;
}

function walkAllFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".next", "node_modules", ".git"].includes(entry.name)) continue;
      walkAllFiles(full, results);
    } else {
      results.push(full);
    }
  }
  return results;
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║      launchkit — Extract Template        ║");
  console.log("╚══════════════════════════════════════════╝\n");

  // Validate source
  if (!fs.existsSync(absSource)) {
    console.error(`  Error: source project not found: ${absSource}\n`);
    process.exit(1);
  }
  if (!fs.existsSync(path.join(absSource, "package.json"))) {
    console.error(`  Error: no package.json found in source — is this a Next.js project?\n`);
    process.exit(1);
  }

  // Check for existing template
  if (fs.existsSync(templateDir) && !force) {
    console.error(`  Error: template "${templateName}" already exists at ${templateDir}`);
    console.error("  Use --force to overwrite.\n");
    process.exit(1);
  }

  // Detect i18n
  const hasI18n = fs.existsSync(path.join(absSource, "i18n-config.ts"));
  const localeSeg = hasI18n ? "[locale]" : "";
  const appLocalePath = ["app", localeSeg].filter(Boolean).join("/");

  console.log(`  Source   : ${absSource}`);
  console.log(`  Template : ${templateName}`);
  console.log(`  i18n     : ${hasI18n ? "detected" : "not detected"}`);

  // Read .launchkit from source if present
  let sourceLaunchkit = null;
  const launchkitPath = path.join(absSource, ".launchkit");
  if (fs.existsSync(launchkitPath)) {
    try {
      sourceLaunchkit = JSON.parse(fs.readFileSync(launchkitPath, "utf8"));
      console.log(`  .launchkit: found (type: ${sourceLaunchkit.type})`);
    } catch { /* ignore malformed */ }
  }

  // Clean existing template dir if --force
  if (fs.existsSync(templateDir)) {
    fs.rmSync(templateDir, { recursive: true, force: true });
    console.log("  [removed] existing template directory");
  }
  if (fs.existsSync(templateModulePath)) {
    fs.rmSync(templateModulePath);
    console.log("  [removed] existing template module");
  }

  const baseFiles = getBaseFiles();
  let totalFiles = 0;

  console.log("\n─── Extracting template files ──────────────────────────────────\n");

  // ── 1. Copy app/[locale]/ (components, page.tsx, layout.tsx) ────────────
  const srcAppLocale = path.join(absSource, appLocalePath);
  const destAppLocale = path.join(templateDir, appLocalePath);
  if (fs.existsSync(srcAppLocale)) {
    const stats = copyRecursive(srcAppLocale, destAppLocale);
    totalFiles += stats.files;
    console.log(`  [copied] ${appLocalePath}/ (${stats.files} files)`);
  }

  // ── 2. Copy app/api/ if present ─────────────────────────────────────────
  const srcApi = path.join(absSource, "app", "api");
  const destApi = path.join(templateDir, "app", "api");
  if (fs.existsSync(srcApi)) {
    const stats = copyRecursive(srcApi, destApi);
    totalFiles += stats.files;
    console.log(`  [copied] app/api/ (${stats.files} files)`);
  }

  // ── 3. Copy app/sitemap.ts, app/robots.ts if present ───────────────────
  for (const file of ["sitemap.ts", "robots.ts"]) {
    const src = path.join(absSource, "app", file);
    if (fs.existsSync(src)) {
      const dest = path.join(templateDir, "app", file);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      totalFiles++;
      console.log(`  [copied] app/${file}`);
    }
  }

  // ── 4. Copy dictionaries/ ──────────────────────────────────────────────
  const srcDict = path.join(absSource, "dictionaries");
  const destDict = path.join(templateDir, "dictionaries");
  if (fs.existsSync(srcDict)) {
    const stats = copyRecursive(srcDict, destDict);
    totalFiles += stats.files;
    console.log(`  [copied] dictionaries/ (${stats.files} files)`);
  }

  // ── 5. Copy public/ (images, assets) ──────────────────────────────────
  if (!skipImages) {
    const srcPublic = path.join(absSource, "public");
    const destPublic = path.join(templateDir, "public");
    if (fs.existsSync(srcPublic)) {
      // Skip base scaffold files in public/ (favicon.ico)
      const stats = copyRecursive(srcPublic, destPublic, { skipSet: new Set(["favicon.ico"]) });
      totalFiles += stats.files;

      // Calculate total size
      const publicFiles = walkAllFiles(destPublic);
      const totalSize = publicFiles.reduce((acc, f) => acc + fs.statSync(f).size, 0);
      const sizeMB = (totalSize / 1024 / 1024).toFixed(1);
      console.log(`  [copied] public/ (${stats.files} files, ${sizeMB} MB)`);
    }
  } else {
    console.log("  [skipped] public/ (--skip-images)");
  }

  // ── 6. Copy globals.css if customized ─────────────────────────────────
  const srcGlobals = path.join(absSource, "app", "globals.css");
  const baseGlobals = path.join(BASE_DIR, "app", "globals.css");
  if (fs.existsSync(srcGlobals) && fs.existsSync(baseGlobals)) {
    const srcContent = fs.readFileSync(srcGlobals, "utf8");
    const baseContent = fs.readFileSync(baseGlobals, "utf8");
    if (srcContent !== baseContent) {
      const dest = path.join(templateDir, "app", "globals.css");
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(srcGlobals, dest);
      totalFiles++;
      console.log("  [copied] app/globals.css (customized)");
    }
  }

  // ── 7. Copy BOOTSTRAP.md if present ───────────────────────────────────
  const srcBootstrap = path.join(absSource, "BOOTSTRAP.md");
  if (fs.existsSync(srcBootstrap)) {
    fs.copyFileSync(srcBootstrap, path.join(templateDir, "BOOTSTRAP.md"));
    totalFiles++;
    console.log("  [copied] BOOTSTRAP.md");
  }

  // ── 8. Detect accent color ────────────────────────────────────────────
  const allTsx = walkAllFiles(path.join(templateDir));
  const detectedColor = sourceLaunchkit?.features?.accentColor || detectAccentColor(allTsx);
  console.log(`\n  Detected accent color: ${detectedColor}`);

  // ── 9. Scan for placeholders ──────────────────────────────────────────
  const PLACEHOLDER_RE = /YOUR_[A-Z_]+/g;
  const placeholders = new Set();
  for (const file of walkAllFiles(templateDir)) {
    if (/\.(tsx?|json|md)$/.test(file)) {
      try {
        const content = fs.readFileSync(file, "utf8");
        let m;
        while ((m = PLACEHOLDER_RE.exec(content)) !== null) {
          placeholders.add(m[0]);
        }
      } catch { /* skip */ }
    }
  }

  // ── 10. Detect components ─────────────────────────────────────────────
  const compDirPath = path.join(templateDir, appLocalePath, "components");
  const components = fs.existsSync(compDirPath)
    ? fs.readdirSync(compDirPath).filter((f) => f.endsWith(".tsx")).map((f) => f.replace(".tsx", ""))
    : [];

  // ── 11. Scan for extra dependencies ───────────────────────────────────
  const basePkg = JSON.parse(fs.readFileSync(path.join(BASE_DIR, "package.json"), "utf8"));
  const srcPkg = JSON.parse(fs.readFileSync(path.join(absSource, "package.json"), "utf8"));
  const extraDeps = {};
  for (const [dep, ver] of Object.entries(srcPkg.dependencies || {})) {
    if (!basePkg.dependencies?.[dep] && !basePkg.devDependencies?.[dep]) {
      extraDeps[dep] = ver;
    }
  }

  // ── 12. Generate template module ──────────────────────────────────────
  console.log("\n─── Generating template module ─────────────────────────────────\n");

  const templateModuleDir = path.join(TOOL_ROOT, "scripts", "templates");
  fs.mkdirSync(templateModuleDir, { recursive: true });

  const depsCode = Object.keys(extraDeps).length > 0
    ? `\n// Extra dependencies beyond base scaffold\nconst EXTRA_DEPS = ${JSON.stringify(extraDeps, null, 2)};\n`
    : "";

  const depsInstallCode = Object.keys(extraDeps).length > 0
    ? `\n  // Add extra dependencies\n  for (const [dep, ver] of Object.entries(EXTRA_DEPS)) {\n    lib.addDependency(dep, ver);\n  }\n`
    : "";

  const templateModule = `// launchkit — ${templateName} template (auto-generated by extract.js)
// Source: ${absSource}
// Extracted: ${new Date().toISOString().split("T")[0]}

const { copyTemplateFiles, replaceInFile } = require("../lib");
const lib = require("../lib");

const TYPE = "${templateName}";
const DESCRIPTION = "${templateName.charAt(0).toUpperCase() + templateName.slice(1)} — extracted template";
const DETECTED_COLOR = "${detectedColor}";

const COLOR_MAP = ["indigo", "blue", "violet", "rose", "amber", "emerald", "cyan", "orange", "teal", "sky", "red", "green"];
const COLOR_LABELS = ["Indigo", "Blue", "Violet", "Rose", "Amber", "Emerald", "Cyan", "Orange", "Teal", "Sky", "Red", "Green"];
${depsCode}
function recolor(fromColor, toColor, compDir, layoutFile) {
  const { target } = require("../lib");
  const fs = require("fs");
  const path = require("path");
  const absCompDir = path.join(target(), compDir);
  if (!fs.existsSync(absCompDir)) return;
  const files = fs.readdirSync(absCompDir).filter((f) => f.endsWith(".tsx"));
  for (const file of files) {
    replaceInFile(path.join(compDir, file), \`\${fromColor}-\`, \`\${toColor}-\`);
  }
  // Also recolor layout
  replaceInFile(layoutFile, \`\${fromColor}-\`, \`\${toColor}-\`);
}

async function setup(rl, answers) {
  const { askChoice } = require("../lib");

  let accentColor;
  if (answers?.accentColor && COLOR_MAP.includes(answers.accentColor)) {
    accentColor = answers.accentColor;
  } else {
    const colorChoice = await askChoice(rl, "Brand accent color?", COLOR_LABELS);
    accentColor = COLOR_MAP[(colorChoice ?? 1) - 1];
  }

  copyTemplateFiles(TYPE);
${depsInstallCode}
  if (accentColor !== DETECTED_COLOR) {
    const i18nActive = require("fs").existsSync(require("path").join(lib.target(), "i18n-config.ts"));
    const compDir = i18nActive ? "app/[locale]/components" : "app/components";
    const layoutFile = i18nActive ? "app/[locale]/layout.tsx" : "app/layout.tsx";
    recolor(DETECTED_COLOR, accentColor, compDir, layoutFile);
  }

  return { type: TYPE, features: { accentColor }, sections: {} };
}

module.exports = { type: TYPE, description: DESCRIPTION, setup, recolor, COLOR_MAP, COLOR_LABELS };
`;

  fs.writeFileSync(templateModulePath, templateModule, "utf8");
  console.log(`  [created] scripts/templates/${templateName}.js`);

  // ── 13. Generate BOOTSTRAP.md if not copied ───────────────────────────
  if (!fs.existsSync(path.join(templateDir, "BOOTSTRAP.md"))) {
    const bootstrapContent = `# ${templateName.charAt(0).toUpperCase() + templateName.slice(1)} — Bootstrap Guide

## Components (${components.length})
${components.map((c) => `- ${c}`).join("\n")}

## Placeholders to replace
${placeholders.size > 0 ? [...placeholders].sort().map((p) => `- \`${p}\``).join("\n") : "None found."}

## Images
Replace placeholder images in \`public/\` with real content before deploying.

## Quick start
\`\`\`bash
npm run dev          # preview
npm run lint         # check for issues
npm run build        # production build
\`\`\`
`;
    fs.writeFileSync(path.join(templateDir, "BOOTSTRAP.md"), bootstrapContent, "utf8");
    console.log("  [created] BOOTSTRAP.md");
  }

  // ── Summary ───────────────────────────────────────────────────────────
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║  Extraction complete!                                        ║");
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log(`║  Template    : ${templateName.padEnd(45)}║`);
  console.log(`║  Files       : ${String(totalFiles).padEnd(45)}║`);
  console.log(`║  Components  : ${String(components.length).padEnd(45)}║`);
  console.log(`║  Accent      : ${detectedColor.padEnd(45)}║`);
  if (placeholders.size > 0) {
  console.log(`║  Placeholders: ${String(placeholders.size).padEnd(45)}║`);
  }
  if (Object.keys(extraDeps).length > 0) {
  console.log(`║  Extra deps  : ${Object.keys(extraDeps).join(", ").padEnd(45)}║`);
  }
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log("║  Usage:                                                      ║");
  console.log(`║  node scripts/setup.js --name foo --output ../ --${templateName.padEnd(13)}║`);
  console.log("╚══════════════════════════════════════════════════════════════╝\n");
}

main();
