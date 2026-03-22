// Hero (portfolio) — Framer Motion animated hero, light background, card_bio field
// Swaps the Hero.tsx component file. No JSX injection needed (Hero is always in page.tsx).

function detect({ compDir, lib }) {
  const fs = require("fs");
  const path = require("path");
  const f = path.join(lib.target(), compDir, "Hero.tsx");
  if (!fs.existsSync(f)) return false;
  const c = fs.readFileSync(f, "utf8");
  // Portfolio hero uses the card_bio dict field
  return c.includes("card_bio");
}

module.exports = { detect };
