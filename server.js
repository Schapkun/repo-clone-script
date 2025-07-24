const { execSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs-extra");

const REPO_URL = "https://github.com/Schapkun/agent-action-atlas.git";
const CLONE_DIR = path.join(__dirname, "github_repo");
const PREVIEW_SOURCE = path.join(CLONE_DIR, "preview_version");
const PREVIEW_DEST = path.join(__dirname, "preview_version");

async function main() {
  console.log("🌀 Cloning project repo...");
  execSync(`git clone ${REPO_URL} ${CLONE_DIR}`, { stdio: "inherit" });

  console.log("📁 Copying preview_version to working directory...");
  fs.copySync(PREVIEW_SOURCE, PREVIEW_DEST, { overwrite: true });

  console.log("📦 Installing dependencies...");
  execSync("npm install", { cwd: PREVIEW_DEST, stdio: "inherit" });

  console.log("📥 Installing TypeScript + types...");
  execSync("npm install --save-dev typescript @types/react @types/node", {
    cwd: PREVIEW_DEST,
    stdio: "inherit",
  });

  console.log("🔧 Building Next.js project...");
  execSync("npm run build", { cwd: PREVIEW_DEST, stdio: "inherit" });

  console.log("🚀 Starting app...");
  spawn("npm", ["start"], {
    cwd: PREVIEW_DEST,
    stdio: "inherit",
    env: { ...process.env, PORT: process.env.PORT || 3000 },
  });
}

main();
