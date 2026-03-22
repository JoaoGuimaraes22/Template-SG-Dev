// about/portfolio — About with bio, callout, fun facts
// Differentiator: uses bio_callout and fun_facts, not stats[]

function detect({ compDir, lib }) {
  const fs = require("fs");
  const path = require("path");
  const f = path.join(lib.target(), compDir, "About.tsx");
  if (!fs.existsSync(f)) return false;
  const c = fs.readFileSync(f, "utf8");
  return c.includes("bio_callout");
}

module.exports = { detect };
