// contact/default (business) — Contact with phone, address, hours, WhatsApp
// Differentiator: has form_phone / contact.phone field

function detect({ compDir, lib }) {
  const fs = require("fs");
  const path = require("path");
  const f = path.join(lib.target(), compDir, "Contact.tsx");
  if (!fs.existsSync(f)) return false;
  const c = fs.readFileSync(f, "utf8");
  return c.includes("form_phone") || c.includes("contact.phone");
}

module.exports = { detect };
