// Parallax Hero hooks — swaps Hero ↔ ParallaxHero in page.tsx

function afterEnable(ctx) {
  const { pageFile, lib } = ctx;

  lib.replaceInFile(
    pageFile,
    'import Hero from "./components/Hero";',
    'import ParallaxHero from "./components/ParallaxHero";'
  );
  lib.replaceInFile(pageFile, "<Hero hero={dict.hero} />", "<ParallaxHero hero={dict.hero} />");
}

function beforeDisable(ctx) {
  const { compDir, pageFile, lib } = ctx;

  // Restore the business Hero.tsx (bg-zinc-900 overlay variant) from the sections library
  lib.copyFile("templates/sections/hero/default/component.tsx", `${compDir}/Hero.tsx`);

  // Swap ParallaxHero → Hero in page.tsx BEFORE standardDisable removes the lines
  lib.replaceInFile(
    pageFile,
    'import ParallaxHero from "./components/ParallaxHero";',
    'import Hero from "./components/Hero";'
  );
  lib.replaceInFile(pageFile, "<ParallaxHero hero={dict.hero} />", "<Hero hero={dict.hero} />");
}

module.exports = { afterEnable, beforeDisable };
