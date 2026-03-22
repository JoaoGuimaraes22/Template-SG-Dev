// Chatbot hooks — layout injection, ChatNudge coupling, API route, dialogflow
const fs = require("fs");
const path = require("path");
const { collapseChatWidgetTsx, collapseChatNudgeTsx } = require(
  path.resolve(__dirname, "../../../../scripts/collapse")
);

// ── Hooks ────────────────────────────────────────────────────────────────────

function afterEnable(ctx) {
  const { projectDir, compDir, layoutFile, i18nActive, lib } = ctx;

  // Copy API route + dialogflow agent
  lib.copyDir("templates/portfolio/app/api/chat", "app/api/chat");
  lib.copyDir("templates/portfolio/dialogflow", "dialogflow");

  // Collapse ChatWidget if i18n disabled
  if (!i18nActive) collapseChatWidgetTsx(compDir);

  // Inject ChatWidget into layout
  const chatWidgetJSX = i18nActive ? "      <ChatWidget locale={locale} />" : "      <ChatWidget />";
  lib.replaceInFile(layoutFile, 'import Navbar from "./components/Navbar";', 'import ChatWidget from "./components/ChatWidget";\nimport Navbar from "./components/Navbar";');
  lib.replaceInFile(layoutFile, "      {children}", `      {children}\n${chatWidgetJSX}`);

  // If sidebar exists, add ChatNudge
  const sidebarAbsPath = path.join(projectDir, compDir, "ProfileSidebar.tsx");
  if (fs.existsSync(sidebarAbsPath)) {
    lib.copyFile("templates/portfolio/app/[locale]/components/ChatNudge.tsx", `${compDir}/ChatNudge.tsx`);
    if (!i18nActive) collapseChatNudgeTsx(compDir);

    const sidebarContent = fs.readFileSync(sidebarAbsPath, "utf8");
    if (!sidebarContent.includes("ChatNudge")) {
      lib.replaceInFile(`${compDir}/ProfileSidebar.tsx`, "import { useRef }", 'import ChatNudge from "./ChatNudge";\nimport { useRef }');
      const ctaRef = i18nActive ? "<CtaButton locale={locale} />" : "<CtaButton />";
      const nudgeJSX = i18nActive ? "<ChatNudge locale={locale} />" : "<ChatNudge />";
      lib.replaceInFile(
        `${compDir}/ProfileSidebar.tsx`,
        `${ctaRef}\n        </motion.div>\n        <motion.div {...fadeUp(inView, 0.45)}`,
        `${ctaRef}\n        </motion.div>\n        <motion.div {...fadeUp(inView, 0.4)}>${nudgeJSX}</motion.div>\n        <motion.div {...fadeUp(inView, 0.45)}`
      );
      lib.replaceInFile(
        `${compDir}/ProfileSidebar.tsx`,
        `${ctaRef}</motion.div>\n      <motion.div className="flex gap-5"`,
        `${ctaRef}</motion.div>\n      <motion.div {...fadeUp(inView, 0.44)}>${nudgeJSX}</motion.div>\n\n      <motion.div className="flex gap-5"`
      );
    }
  }
}

function afterDisable(ctx) {
  const { projectDir, compDir, layoutFile, lib } = ctx;

  // Remove API route + dialogflow
  lib.deleteIfExists("app/api/chat");
  lib.deleteIfExists("dialogflow");

  // Remove ChatWidget from layout
  lib.removeLineContaining(layoutFile, 'import ChatWidget from "./components/ChatWidget"');
  lib.removeLineContaining(layoutFile, "<ChatWidget");

  // Remove ChatNudge if sidebar exists
  const sidebarAbsPath = path.join(projectDir, compDir, "ProfileSidebar.tsx");
  if (fs.existsSync(sidebarAbsPath)) {
    lib.deleteIfExists(`${compDir}/ChatNudge.tsx`);
    lib.removeLineContaining(`${compDir}/ProfileSidebar.tsx`, 'import ChatNudge from "./ChatNudge"');
    lib.removeLineContaining(`${compDir}/ProfileSidebar.tsx`, "<ChatNudge");
  }
}

module.exports = { afterEnable, afterDisable };
