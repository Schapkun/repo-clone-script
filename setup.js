const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs-extra");

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

    console.log("✅ Setup completed successfully.");
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

// 🔚 Zorg dat het proces stopt
main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
