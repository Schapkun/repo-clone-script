const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs-extra");
const express = require("express");
const next = require("next");

const REPO_URL = "https://github.com/Schapkun/agent-action-atlas.git";
const CLONE_DIR = path.join(__dirname, "github_repo");
const PREVIEW_SOURCE = path.join(CLONE_DIR, "preview_version");
const PREVIEW_DEST = path.join(__dirname, "preview_version");

async function main() {
  try {
    if (fs.existsSync(CLONE_DIR)) {
      console.log("♻️  Cleaning old repo clone...");
      fs.removeSync(CLONE_DIR);
    }

    console.log("🌀 Cloning project repo...");
    execSync(`git clone --depth=1 ${REPO_URL} ${CLONE_DIR}`, { stdio: "inherit" });

    console.log("📁 Copying preview_version to working directory...");
    fs.copySync(PREVIEW_SOURCE, PREVIEW_DEST, { overwrite: true });

    console.log("📦 Installing all dependencies including dev...");
    execSync("npm install --include=dev", { cwd: PREVIEW_DEST, stdio: "inherit" });

    console.log("🔧 Building Next.js project...");
    execSync("npm run build", { cwd: PREVIEW_DEST, stdio: "inherit" });

    console.log("🚀 Starting Next.js server...");
    const app = express();
    const port = process.env.PORT || 3000;

    const nextApp = next({ dev: false, dir: PREVIEW_DEST });
    const handle = nextApp.getRequestHandler();

    await nextApp.prepare();

    app.all("*", (req, res) => {
      console.log(`📩 ${req.method} ${req.url}`);
      return handle(req, res);
    });

    app.listen(port, () => {
      console.log(`✅ Server ready on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Startup failed:", error);
    process.exit(1);
  }
}

main();
