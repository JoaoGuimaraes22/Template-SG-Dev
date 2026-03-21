// FloatingCTA hooks — structural section placed after Footer (not interactively positioned)

function afterEnable(ctx) {
  const { pageFile, meta, lib } = ctx;

  // Add import before Footer import
  lib.replaceInFile(
    pageFile,
    'import Footer from "./components/Footer";',
    'import FloatingCTA from "./components/FloatingCTA";\nimport Footer from "./components/Footer";'
  );

  // Add JSX after Footer JSX
  const propsKey = ctx.i18nActive ? "i18n" : "collapsed";
  const jsxProps = meta.props[propsKey];
  lib.replaceInFile(
    pageFile,
    "      <Footer footer={dict.footer} logo={dict.navbar.logo} />",
    `      <Footer footer={dict.footer} logo={dict.navbar.logo} />\n      <FloatingCTA ${jsxProps} />`
  );
}

module.exports = { afterEnable };
