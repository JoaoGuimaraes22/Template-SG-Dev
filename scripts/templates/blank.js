// launchkit — blank template
// Minimal scaffold with i18n infrastructure and an empty page.
// Use this as a starting point to build a site from scratch.

const { copyTemplateFiles } = require("../lib");

const TYPE = "blank";
const DESCRIPTION = "Blank — minimal scaffold with i18n (clean starting point)";

async function setup() {
  copyTemplateFiles(TYPE);
  return { type: TYPE, features: {}, sections: {} };
}

module.exports = { type: TYPE, description: DESCRIPTION, setup };
