const express = require("express");
const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

const REPO_URL = "https://github.com/Schapkun/agent-action-atlas.git";
const CLONE_DIR = path.join(__dirname, "github_repo");
const PREVIEW_SOURCE = path.join(CLONE_DIR, "preview_version");
const PREVIEW_DEST = path.join(__dirname, "preview_version");

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Repo clonen
console.log("Cloning repo...");
execSync(`git clone ${REPO_URL} ${CLONE_DIR}`, { stdio: "inherit" });

// 2. preview_version map kopiëren
console.log("Copying preview_version to working directory...");
fs.copySync(PREVIEW_SOURCE, PREVIEW_DEST, { overwrite: true });

// 3. Statische bestanden serveren vanuit preview_version
console.log("Starting static file server...");
app.use(express.static(PREVIEW_DEST));

// 4. Fallback voor niet-bestaande routes
app.use((req, res) => {
  res.status(404).send("Bestand niet gevonden in preview_version.");
});

app.listen(PORT, () =>
  console.log(`✅ Server actief op http://localhost:${PORT}`)
);
