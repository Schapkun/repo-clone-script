const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

const REPO_URL = "https://github.com/Schapkun/agent-action-atlas.git";
const CLONE_DIR = path.join(__dirname, "github_repo");
const PREVIEW_SOURCE = path.join(CLONE_DIR, "preview_version");
const PREVIEW_DEST = path.join(__dirname, "preview_version");

// 1. Repo clonen
console.log("Cloning repo...");
execSync(`git clone ${REPO_URL} ${CLONE_DIR}`, { stdio: "inherit" });

// 2. preview_version map kopiëren
console.log("Copying preview_version to working directory...");
fs.copySync(PREVIEW_SOURCE, PREVIEW_DEST, { overwrite: true });

// 3. Dummy server om Render alive te houden
console.log("Starting dummy server to keep service alive...");
require("http")
  .createServer((req, res) => {
    res.writeHead(200);
    res.end("AI preview server running. Files are ready.");
  })
  .listen(process.env.PORT || 3000);
