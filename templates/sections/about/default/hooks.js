// about/default (business) — About with image + stats grid
// Differentiator: uses about.stats[], not bio_callout/fun_facts

function detect({ compDir, lib }) {
  const fs = require("fs");
  const path = require("path");
  const f = path.join(lib.target(), compDir, "About.tsx");
  if (!fs.existsSync(f)) return false;
  const c = fs.readFileSync(f, "utf8");
  return c.includes("about.stats");
}

module.exports = { detect };
