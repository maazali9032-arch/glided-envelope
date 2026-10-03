// Preview the actual Vercel build output. Vite's stock Start preview expects
// dist/server, while Nitro's Vercel preset produces .vercel/output instead.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { Readable } from "node:stream";

const output = resolve(".vercel/output");
const staticRoot = resolve(output, "static");
const entry = resolve(output, "functions/__server.func/index.mjs");
try {
  await stat(entry);
} catch {
  throw new Error("Run npm run build before npm run preview.");
}
const { default: app } = await import(pathToFileURL(entry).href);
const args = process.argv.slice(2);
const portIndex = args.indexOf("--port");
const port = Number(portIndex >= 0 ? args[portIndex + 1] : 4173);
const host = args.includes("--host") ? args[args.indexOf("--host") + 1] : "127.0.0.1";
const mime = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".mp3": "audio/mpeg",
  ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    let file;
    try {
      file = resolve(staticRoot, "." + decodeURIComponent(url.pathname));
    } catch {
      /* malformed paths belong to the application's not-found handling */
    }
    if ((req.method === "GET" || req.method === "HEAD") && file?.startsWith(staticRoot + sep)) {
      const info = await stat(file).catch(() => undefined);
      if (info?.isFile()) {
        res.setHeader("Content-Type", mime[extname(file)] || "application/octet-stream");
        res.end(req.method === "HEAD" ? undefined : await readFile(file));
        return;
      }
    }
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
    const init = { method: req.method, headers };
    if (req.method !== "GET" && req.method !== "HEAD") {
      init.body = Readable.toWeb(req);
      init.duplex = "half";
    }
    const response = await app.fetch(new Request(url, init), {
      waitUntil: (promise) => promise.catch(console.error),
    });
    res.writeHead(response.status, Object.fromEntries(response.headers));
    if (response.body && req.method !== "HEAD") Readable.fromWeb(response.body).pipe(res);
    else res.end();
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Preview failed. Check the terminal output.");
  }
}).listen(port, host, () => console.log(`Vercel build preview: http://${host}:${port}`));
