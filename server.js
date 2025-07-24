const express = require("express");
const next = require("next");
const path = require("path");

const PREVIEW_DEST = path.join(__dirname, "preview_version");

async function main() {
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
}

main();
