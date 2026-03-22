// contact/portfolio — Contact with GitHub, LinkedIn, email only
// Differentiator: has github / linkedin fields, no phone

function detect({ compDir, lib }) {
  const fs = require("fs");
  const path = require("path");
  const f = path.join(lib.target(), compDir, "Contact.tsx");
  if (!fs.existsSync(f)) return false;
  const c = fs.readFileSync(f, "utf8");
  return c.includes("contact.github") || c.includes("email_label");
}

module.exports = { detect };
