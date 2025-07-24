const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs-extra");

const REPO_URL = "https://github.com/Schapkun/agent-action-atlas.git";
const CLONE_DIR = path.join(__dirname, "github_repo");
const PREVIEW_SOURCE = path.join(CLONE_DIR, "preview_version");
const PREVIEW_DEST = path.join(__dirname, "preview_version");

(async () => {
  try {
    if (fs.existsSync(CLONE_DIR)) {
      console.log("🧹 Cleaning up old repo...");
      fs.removeSync(CLONE_DIR);
    }

    console.log("🌀 Cloning repo...");
    execSync(`git clone --depth=1 ${REPO_URL} ${CLONE_DIR}`, { stdio: "inherit" });

    console.log("📁 Copying preview_version...");
    fs.copySync(PREVIEW_SOURCE, PREVIEW_DEST, { overwrite: true });

    console.log("📦 Installing all dependencies...");
    execSync("npm install", { cwd: PREVIEW_DEST, stdio: "inherit" });

    console.log("📥 Installing TypeScript & types...");
    execSync("npm install --save-dev typescript @types/react @types/node", { cwd: PREVIEW_DEST, stdio: "inherit" });

    console.log("🔧 Building project...");
    execSync("npm run build", { cwd: PREVIEW_DEST, stdio: "inherit" });

    console.log("✅ Setup complete.");
  } catch (err) {
    console.error("❌ Setup failed:", err);
    process.exit(1);
  }
})();
