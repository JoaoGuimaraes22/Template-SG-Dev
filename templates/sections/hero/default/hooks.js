// Hero (business) — dark image-based hero with overlay
// Swaps the Hero.tsx component file. No JSX injection needed (Hero is always in page.tsx).

function detect({ compDir, lib }) {
  const fs = require("fs");
  const path = require("path");
  const f = path.join(lib.target(), compDir, "Hero.tsx");
  if (!fs.existsSync(f)) return false;
  const c = fs.readFileSync(f, "utf8");
  // Business hero uses a dark bg overlay and setTimeout for fade-in
  return c.includes("bg-zinc-900/65") || (c.includes("setTimeout") && c.includes("hero.jpg"));
}

module.exports = { detect };
