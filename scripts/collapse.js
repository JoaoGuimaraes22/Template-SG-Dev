// launchkit — Shared i18n collapse helpers for individual components.
// Used by scripts/templates/portfolio.js (setup-time collapse) and
// templates/sections/chatbot/default/hooks.js (section-add-time collapse).
//
// All functions resolve file paths against the shared _target set via lib.setTarget().

const { removeLineContaining, replaceInFile } = require("./lib");

function collapseChatWidgetTsx(compDir) {
  removeLineContaining(`${compDir}/ChatWidget.tsx`, "import { type Locale }");
  replaceInFile(
    `${compDir}/ChatWidget.tsx`,
    "const strings = {\n  en: {\n    title: \"Chat with me\",\n    subtitle: \"Typically replies instantly\",\n    placeholder: \"Type a message...\",\n    greeting: \"Hi! I'm YOUR_NAME's assistant. Ask me anything about their work, services, or availability.\",\n    ariaLabel: \"Open chat\",\n    bubble: \"Ask me anything\",\n    chips: [\"What services do you offer?\", \"What's your pricing?\", \"Are you available?\", \"Show me your work\"],\n  },\n  pt: {\n    title: \"Fala comigo\",\n    subtitle: \"Responde quase instantaneamente\",\n    placeholder: \"Escreve uma mensagem...\",\n    greeting: \"Olá! Sou o assistente de YOUR_NAME. Pergunta-me sobre o seu trabalho, serviços ou disponibilidade.\",\n    ariaLabel: \"Abrir chat\",\n    bubble: \"Pergunta-me algo\",\n    chips: [\"Que serviços ofereces?\", \"Qual é o teu preço?\", \"Estás disponível?\", \"Mostra o teu trabalho\"],\n  },\n};\n\nexport default function ChatWidget({ locale }: { locale: Locale }) {",
    "const s = {\n  title: \"Chat with me\",\n  subtitle: \"Typically replies instantly\",\n  placeholder: \"Type a message...\",\n  greeting: \"Hi! I'm YOUR_NAME's assistant. Ask me anything about their work, services, or availability.\",\n  ariaLabel: \"Open chat\",\n  bubble: \"Ask me anything\",\n  chips: [\"What services do you offer?\", \"What's your pricing?\", \"Are you available?\", \"Show me your work\"],\n};\n\nexport default function ChatWidget() {"
  );
  removeLineContaining(`${compDir}/ChatWidget.tsx`, "const s = strings[locale]");
  replaceInFile(`${compDir}/ChatWidget.tsx`, "message: text, sessionId, locale", 'message: text, sessionId, locale: "en"');
  replaceInFile(
    `${compDir}/ChatWidget.tsx`,
    'locale === "pt" ? "Erro de ligação. Tenta novamente." : "Connection error. Please try again."',
    '"Connection error. Please try again."'
  );
}

function collapseChatNudgeTsx(compDir) {
  replaceInFile(
    `${compDir}/ChatNudge.tsx`,
    'import { type Locale } from "../../../i18n-config";\n\nconst nudgeText: Record<Locale, string> = {\n  en: "Have questions? Chat with me",\n  pt: "Tens dúvidas? Fala comigo",\n};\n\nexport default function ChatNudge({ locale }: { locale: Locale }) {',
    "export default function ChatNudge() {"
  );
  replaceInFile(
    `${compDir}/ChatNudge.tsx`,
    "{nudgeText[locale] ?? nudgeText.en}",
    '"Have questions? Chat with me"'
  );
}

module.exports = { collapseChatWidgetTsx, collapseChatNudgeTsx };
