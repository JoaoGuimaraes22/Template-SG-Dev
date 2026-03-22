#!/usr/bin/env node
// launchkit — Portfolio template module
// Owns: template file copy + i18n collapse logic.
// i18n feature toggle is prompted and applied by setup.js via configs/setup/i18n/.
// Optional sections (chatbot, sidebar, work, testimonials, webgl-hero, contact-form)
// are managed via sections.js / presets — not bundled here.

const {
  copyTemplateFiles,
  deleteIfExists,
  removeLineContaining,
  replaceInFile,
  collapseI18nBase,
} = require("../lib");

const TYPE = "portfolio";

// ── Full i18n collapse (app/[locale]/ → app/) ─────────────────────────────────

function collapseI18n() {
  // Remove i18n-only components before collapse so they aren't copied to app/components/
  deleteIfExists("app/[locale]/components/LanguageSwitcher.tsx");
  deleteIfExists("app/[locale]/components/LangSetter.tsx");
  collapseI18nBase({}, {
    pageFnName: "LocalePage",
    beforePatchLayout() {
      replaceInFile(
        "app/layout.tsx",
        '  const description =\n    locale === "pt"\n      ? "Descrição curta do seu perfil em português. Disponível para freelance."\n      : "Short description of your profile in English. Available for freelance.";',
        '  const description = "Short description of your profile in English. Available for freelance.";'
      );
    },
    afterCollapse() {
      // Layout patches
      removeLineContaining("app/layout.tsx", "import LangSetter");
      removeLineContaining("app/layout.tsx", "<LangSetter");

      // Navbar patches
      removeLineContaining("app/components/Navbar.tsx", "import LanguageSwitcher");
      replaceInFile("app/components/Navbar.tsx", "href={`/${locale}`}", 'href="/"');
      removeLineContaining("app/components/Navbar.tsx", "<LanguageSwitcher");
      deleteIfExists("app/components/LanguageSwitcher.tsx");
      deleteIfExists("app/components/LangSetter.tsx");
    },
  });
}

// ── Template file copy ────────────────────────────────────────────────────────

async function setup() {
  console.log("\n─── Copying portfolio template ─────────────────────────────────\n");
  copyTemplateFiles(TYPE);
  return { type: TYPE, sections: {} };
}

module.exports = { type: TYPE, setup, collapseI18n };
