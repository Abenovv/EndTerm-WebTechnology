const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
function serve(root, port = 0) {
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".png": "image/png",
    ".json": "application/json",
    ".pdf": "application/pdf",
  };
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let file;
      try {
        file = path.resolve(
          root,
          "." +
            decodeURIComponent(new URL(req.url, "http://localhost").pathname),
        );
      } catch {
        res.writeHead(400);
        res.end();
        return;
      }
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory())
        file = path.join(file, "index.html");
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
      });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}
module.exports = serve;
if (require.main === module)
  serve(path.resolve(__dirname, ".."), 8768).then(() =>
    console.log("SIDEQUEST: http://127.0.0.1:8768/"),
  );
