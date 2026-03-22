// services/portfolio — Services with animated accordion + tech stack strip
// Differentiator: uses stack_label and items[].details[]

function detect({ compDir, lib }) {
  const fs = require("fs");
  const path = require("path");
  const f = path.join(lib.target(), compDir, "Services.tsx");
  if (!fs.existsSync(f)) return false;
  const c = fs.readFileSync(f, "utf8");
  return c.includes("stack_label");
}

module.exports = { detect };
