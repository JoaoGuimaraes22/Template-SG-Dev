#!/usr/bin/env node
// launchkit — Deploy
// Builds the project and deploys to Vercel or Netlify.
// Run: node scripts/deploy.js --project ../my-site
//      node scripts/deploy.js --project ../my-site --platform vercel

const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const {
  target, setTarget, parseProjectFlag, readLaunchkit, writeLaunchkit, checkHelp,
} = require("./lib");

checkHelp(`
launchkit — Deploy

  Builds the generated project and deploys it to Vercel or Netlify.
  Prints the live URL and stores it in .launchkit.

  Prerequisites:
    Vercel  — npm i -g vercel  then  vercel login
    Netlify — npm i -g netlify-cli  then  netlify login

Usage:
  node scripts/deploy.js [--project <path>] [--platform vercel|netlify]

Options:
  --project <path>         Path to the generated project (default: cwd)
  --platform vercel|netlify  Force a specific platform (auto-detected if omitted)
  --no-build               Skip npm run build (deploy existing .next / out dir)
  -h, --help               Show this help message

Examples:
  node scripts/deploy.js --project ../my-site
  node scripts/deploy.js --project ../my-site --platform netlify
`);

// ── Resolve target project ───────────────────────────────────────────────────
setTarget(parseProjectFlag());

function getFlag(name) {
  const idx = process.argv.indexOf(name);
  return idx !== -1 && process.argv[idx + 1] ? process.argv[idx + 1] : null;
}

const forcePlatform = getFlag("--platform");
const skipBuild = process.argv.includes("--no-build");

// ── CLI detection ─────────────────────────────────────────────────────────────

function cliAvailable(cmd) {
  const result = spawnSync(cmd, ["--version"], { stdio: "pipe" });
  return result.status === 0;
}

function detectPlatform() {
  if (forcePlatform) {
    if (!["vercel", "netlify"].includes(forcePlatform)) {
      console.error(`  [error] Unknown platform: ${forcePlatform}. Use vercel or netlify.`);
      process.exit(1);
    }
    return forcePlatform;
  }
  if (cliAvailable("vercel")) return "vercel";
  if (cliAvailable("netlify")) return "netlify";
  return null;
}

// ── Deploy ────────────────────────────────────────────────────────────────────

function run(cmd, opts = {}) {
  console.log(`\n  $ ${cmd}`);
  execSync(cmd, { cwd: target(), stdio: "inherit", ...opts });
}

function captureOutput(cmd) {
  try {
    return execSync(cmd, { cwd: target(), stdio: "pipe" }).toString().trim();
  } catch {
    return null;
  }
}

function deployVercel() {
  run("vercel --prod --yes");
  // Capture the latest deployment URL
  const url = captureOutput("vercel ls --prod 2>/dev/null | awk 'NR==2{print $2}'") ||
               captureOutput("vercel inspect --prod 2>/dev/null | grep 'url' | head -1 | awk '{print $2}'");
  return url ? (url.startsWith("http") ? url : `https://${url}`) : null;
}

function deployNetlify() {
  run("netlify deploy --build --prod");
  const output = captureOutput("netlify status 2>/dev/null");
  const match = output?.match(/Site url:\s+(https?:\/\/\S+)/i);
  return match ? match[1] : null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║         launchkit — Deploy               ║");
  console.log("╚══════════════════════════════════════════╝");

  const state = readLaunchkit();
  const platform = detectPlatform();

  if (!platform) {
    console.error(`
  [error] No deployment CLI found.

  Install one of:
    npm i -g vercel        → then: vercel login
    npm i -g netlify-cli   → then: netlify login
`);
    process.exit(1);
  }

  console.log(`\n  Platform : ${platform}`);
  console.log(`  Project  : ${target()}`);

  // Step 1: Build
  if (!skipBuild) {
    console.log("\n─── Building ─────────────────────────────────────────────────────\n");
    run("npm run build");
  } else {
    console.log("\n  [skip] Build skipped (--no-build)");
  }

  // Step 2: Deploy
  console.log("\n─── Deploying ────────────────────────────────────────────────────\n");
  let deployUrl = null;

  if (platform === "vercel") {
    deployUrl = deployVercel();
  } else {
    deployUrl = deployNetlify();
  }

  // Step 3: Store URL and report
  if (deployUrl) {
    state.features = state.features ?? {};
    state.features.deployUrl = deployUrl;
    writeLaunchkit(state);

    console.log("\n─── Deployed ─────────────────────────────────────────────────────\n");
    console.log(`  Live URL : ${deployUrl}`);
    console.log(`  Stored in .launchkit features.deployUrl`);
    console.log(`\n  ✓  Share this link with your client.\n`);
  } else {
    console.log("\n─── Deployed ─────────────────────────────────────────────────────\n");
    console.log("  Deploy succeeded. Could not capture URL automatically.");
    console.log(`  Check your ${platform} dashboard for the live URL.\n`);
  }
}

main().catch((err) => {
  console.error("\n  [error]", err.message);
  process.exit(1);
});
