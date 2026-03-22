#!/usr/bin/env node
// launchkit — Project Config
// Manages project-wide settings: i18n status display, accent color recolor, palette.
// Run: node scripts/config.js --project ../my-project

const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { target, setTarget, parseProjectFlag, readLaunchkit, writeLaunchkit, replaceInFile, askChoice, checkHelp, loadTemplates, loadPalettes } = require("./lib");

checkHelp(`
launchkit — Config

  View and update project-wide settings (i18n, accent color, design palette).

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
  const tmpl = TEMPLATES[type] ?? TEMPLATES.blank;

  const i18nActive = fs.existsSync(path.join(target(), "i18n-config.ts"));
  const compDir = i18nActive ? "app/[locale]/components" : "app/components";
  const layoutFile = i18nActive ? "app/[locale]/layout.tsx" : "app/layout.tsx";

  console.log(`\n  Template : ${type.charAt(0).toUpperCase() + type.slice(1)}`);
  console.log(`  Project  : ${target()}`);
  console.log(`  i18n     : ${i18nActive ? "enabled" : "disabled (collapsed)"}`);

  // Build menu options
  const palettes = loadPalettes();
  const currentPalette = state.features?.palette ?? "default";
  const currentColor = state.features?.accentColor ?? "indigo";

  const options = [
    { key: "i18n", label: `i18n routing — ${i18nActive ? "enabled" : "disabled"} (requires reset + setup to change)` },
  ];

  if (palettes.length > 0) {
    options.push({ key: "palette", label: `Design palette — current: ${currentPalette} (bg + fg + accent together)` });
  }

  if (tmpl.recolor) {
    options.push({ key: "accentColor", label: `Brand accent color — current: ${currentColor} (accent only)` });
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    const choice = await askChoice(rl, "\n  Select setting to configure:", options.map((o) => o.label));
    if (!choice) { console.log("\n  Cancelled.\n"); return; }

    const selected = options[choice - 1];

    if (selected.key === "i18n") {
      console.log("\n  i18n routing cannot be toggled in-place.");
      console.log("  Run reset + setup to change this setting.\n");
      return;
    }

    if (selected.key === "palette") {
      const paletteLabels = palettes.map((p) => `${p.name} — ${p.description}${p.name === currentPalette ? " (current)" : ""}`);
      const paletteChoice = await askChoice(rl, "\n  Select design palette:", paletteLabels);
      if (!paletteChoice) { console.log("\n  Cancelled.\n"); return; }
      const palette = palettes[paletteChoice - 1];
      if (palette.name === currentPalette) {
        console.log("\n  No change — same palette selected.\n");
        return;
      }
      console.log(`\n─── Applying palette: ${palette.name} ──────────────────────────────────────\n`);

      // Read current bg/fg directly from globals.css (robust to manual edits)
      const globalsPath = path.join(target(), "app/globals.css");
      const globalsContent = fs.readFileSync(globalsPath, "utf8");
      const bgMatch = globalsContent.match(/--background:\s*([^;]+);/);
      const fgMatch = globalsContent.match(/--foreground:\s*([^;]+);/);
      const currBg = bgMatch ? bgMatch[1].trim() : "#fafafa";
      const currFg = fgMatch ? fgMatch[1].trim() : "#111111";

      replaceInFile("app/globals.css", `--background: ${currBg}`, `--background: ${palette.background}`);
      replaceInFile("app/globals.css", `--foreground: ${currFg}`, `--foreground: ${palette.foreground}`);

      // Recolor accent if changed (use tmpl.recolor if available, else skip)
      if (palette.accent !== currentColor && tmpl.recolor) {
        console.log(`  Recoloring accent: ${currentColor} → ${palette.accent}`);
        tmpl.recolor(currentColor, palette.accent, compDir, layoutFile);
      }

      state.features.palette = palette.name;
      state.features.accentColor = palette.accent;
      writeLaunchkit(state);
      console.log(`\n  Palette applied: ${palette.name}`);
      console.log(`  bg: ${palette.background}  fg: ${palette.foreground}  accent: ${palette.accent}`);
      console.log("  Run npm run dev to preview.\n");
    }

    if (selected.key === "accentColor") {
      if (!tmpl.recolor) return;
      const fromColor = currentColor;
      const colorChoice = await askChoice(rl, `\n  Current color: ${fromColor}\n  Select new accent color:`, tmpl.COLOR_LABELS);
      if (!colorChoice) { console.log("\n  Cancelled.\n"); return; }
      const toColor = tmpl.COLOR_MAP[colorChoice - 1];
      if (toColor === fromColor) {
        console.log("\n  No change — same color selected.\n");
        return;
      }
      console.log(`\n─── Recoloring: ${fromColor} → ${toColor} ────────────────────────────────────\n`);
      tmpl.recolor(fromColor, toColor, compDir, layoutFile);
      state.features.accentColor = toColor;
      writeLaunchkit(state);
      console.log(`\n  Accent color updated: ${fromColor} → ${toColor}.`);
      console.log("  Run npm run dev to preview.\n");
    }
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error("Config failed:", err);
  process.exit(1);
});
