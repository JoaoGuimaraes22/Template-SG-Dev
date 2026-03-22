// launchkit — i18n setup config hook
// Handles the file-system side of the i18n feature toggle at project creation time.
// Called by setup.js after tmpl.setup() has copied the template files.

const fs = require("fs");
const path = require("path");

const SITEMAP_CONTENT =
  `import type { MetadataRoute } from "next";\n` +
  `\n` +
  `const SITE_URL = "https://YOUR_DOMAIN";\n` +
  `\n` +
  `export default function sitemap(): MetadataRoute.Sitemap {\n` +
  `  return [{ url: SITE_URL, lastModified: new Date() }];\n` +
  `}\n`;

async function apply(ctx) {
  // ctx: { enabled, projectType, tmpl, lib }
  const { enabled, projectType, tmpl, lib } = ctx;
  if (enabled) {
    lib.copyDir(`templates/presets/${projectType}/root`, ".");
  } else {
    fs.writeFileSync(path.join(lib.target(), "app/sitemap.ts"), SITEMAP_CONTENT, "utf8");
    console.log("  [created] sitemap.ts");
    if (tmpl.collapseI18n) tmpl.collapseI18n();
  }
}

module.exports = { apply };
