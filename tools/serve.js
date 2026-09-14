/* Local preview server: npm run serve → http://localhost:8080

   Also serves /api/* through the same handler the hosts use, so the admin's
   login-and-publish flow can be exercised locally. Set ADMIN_PASSWORD,
   SESSION_SECRET, GITHUB_TOKEN, GITHUB_OWNER and GITHUB_REPO in your
   environment to try it (an .env is not read — export them in the shell). */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = process.env.PORT || 8080;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
};

/* Bridge Node's req/res to the Web-standard handler in api/_core.mjs. */
async function serveApi(req, res) {
  const { handle } = await import('../api/_core.mjs');
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;

  const request = new Request('http://localhost:' + PORT + req.url, {
    method: req.method,
    headers: req.headers,
    body: (req.method === 'GET' || req.method === 'HEAD') ? undefined : body,
  });

  const out = await handle(request, process.env);
  const headers = {};
  out.headers.forEach((v, k) => { headers[k] = v; });
  res.writeHead(out.status, headers);
  res.end(Buffer.from(await out.arrayBuffer()));
}

http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    serveApi(req, res).catch(err => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });
    return;
  }

  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  const file = path.join(ROOT, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  fs.readFile(file, (err, data) => {
    if (err) {
      const fallback = path.join(ROOT, '404.html');
      return fs.readFile(fallback, (e2, d2) => {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(e2 ? 'Not found' : d2);
      });
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log('→ http://localhost:' + PORT));
