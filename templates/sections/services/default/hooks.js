// services/default (business) — Services with icon cards, no stack section
// Differentiator: items have no details[], no stack_label

function detect({ compDir, lib }) {
  const fs = require("fs");
  const path = require("path");
  const f = path.join(lib.target(), compDir, "Services.tsx");
  if (!fs.existsSync(f)) return false;
  const c = fs.readFileSync(f, "utf8");
  return c.includes("Services") && !c.includes("stack_label");
}

module.exports = { detect };
