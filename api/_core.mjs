/* Shared publish API.

   Written against Web standards only (fetch, Request/Response, Web Crypto), so
   the identical code runs on Vercel Edge Functions and Cloudflare Pages
   Functions. No dependencies.

   The GitHub token lives in a server environment variable and never reaches the
   browser. The admin authenticates with a password and gets an HttpOnly signed
   session cookie — which is what makes editing from a phone practical. */

const COOKIE = 'flux_session';
const SESSION_DAYS = 14;

/* Only these paths may ever be written. An authenticated client could
   otherwise push arbitrary files into the repository. */
const ALLOWED_PATHS = new Set([
  'index.html',
  'fieldhouse.html',
  'broadcasters-toolkit.html',
  'consulting.html',
  'about.html',
  'contact.html',
  '404.html',
  'assets/img/favicon.svg',
  'sitemap.xml',
  'robots.txt',
  'content.json',
]);

/* Gallery photos, written by the admin's image uploader. Kept deliberately
   tight: a fixed folder, a safe filename, and image extensions only. */
const GALLERY_RE = /^assets\/img\/gallery\/[a-z0-9][a-z0-9._-]{0,60}\.(jpg|jpeg|png|webp)$/;

const MAX_FILE_BYTES = 2 * 1024 * 1024;   // 2 MB per file
const MAX_FILES = 40;

const pathAllowed = (p) => ALLOWED_PATHS.has(p) || GALLERY_RE.test(p);

/* An entry is either a plain string (text) or { encoding:'base64', content }. */
function entryBytes(entry) {
  if (typeof entry === 'string') return enc.encode(entry).length;
  return Math.floor(String(entry.content || '').length * 0.75);
}

const enc = new TextEncoder();
const dec = new TextDecoder();

/* ---------- encoding ---------- */
function b64url(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function unb64url(str) {
  let s = String(str).replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function b64utf8(str) {
  const bytes = enc.encode(str);
  let bin = '';
  const CH = 0x8000;
  for (let i = 0; i < bytes.length; i += CH) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
  }
  return btoa(bin);
}

/* ---------- crypto ---------- */
async function hmacKey(secret) {
  return crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']
  );
}

async function digest(secret, value) {
  const key = await hmacKey(secret);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(value)));
}

/* Compares HMACs rather than raw values, so a timing difference cannot leak
   anything about the password itself. */
async function secretsMatch(secret, a, b) {
  const [da, db] = await Promise.all([digest(secret, a), digest(secret, b)]);
  return da === db;
}

async function mintSession(secret) {
  const payload = b64url(enc.encode(JSON.stringify({
    exp: Date.now() + SESSION_DAYS * 86400000,
  })));
  return payload + '.' + await digest(secret, payload);
}

async function readSession(token, secret) {
  const parts = String(token || '').split('.');
  if (parts.length !== 2) return null;
  const key = await hmacKey(secret);
  let ok = false;
  try {
    ok = await crypto.subtle.verify('HMAC', key, unb64url(parts[1]), enc.encode(parts[0]));
  } catch (e) { return null; }
  if (!ok) return null;
  try {
    const payload = JSON.parse(dec.decode(unb64url(parts[0])));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch (e) { return null; }
}

function readCookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

function sessionCookie(value, maxAge) {
  return [
    COOKIE + '=' + encodeURIComponent(value),
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Max-Age=' + maxAge,
  ].join('; ');
}

/* ---------- responses ---------- */
const json = (body, status, headers) => new Response(JSON.stringify(body), {
  status: status || 200,
  headers: Object.assign({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  }, headers || {}),
});

/* ---------- GitHub ---------- */
async function gh(env, path, init) {
  const res = await fetch('https://api.github.com' + path, Object.assign({}, init, {
    headers: Object.assign({
      Authorization: 'Bearer ' + env.GITHUB_TOKEN,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'flux-athletics-admin',
    }, (init && init.headers) || {}),
  }));
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json()).message || ''; } catch (e) { /* non-JSON */ }
    let hint = '';
    if (res.status === 403 || res.status === 404) {
      hint = ' — check GITHUB_TOKEN is a fine-grained token for this repository with "Contents: Read and write".';
    } else if (res.status === 401) {
      hint = ' — GITHUB_TOKEN was rejected; it may have expired.';
    }
    throw new Error('GitHub ' + res.status + ' on ' + path + (detail ? ': ' + detail : '') + hint);
  }
  return res.json();
}

async function commitFiles(env, files, message) {
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || 'main';
  const base = '/repos/' + owner + '/' + repo;

  const ref = await gh(env, base + '/git/ref/heads/' + branch);
  const baseSha = ref.object.sha;
  const baseCommit = await gh(env, base + '/git/commits/' + baseSha);

  const tree = [];
  for (const [path, entry] of Object.entries(files)) {
    const body = (entry && typeof entry === 'object' && entry.encoding === 'base64')
      ? { content: entry.content, encoding: 'base64' }
      : { content: b64utf8(entry), encoding: 'base64' };
    const blob = await gh(env, base + '/git/blobs', { method: 'POST', body: JSON.stringify(body) });
    tree.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  const newTree = await gh(env, base + '/git/trees', {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree }),
  });

  const commit = await gh(env, base + '/git/commits', {
    method: 'POST',
    body: JSON.stringify({ message, tree: newTree.sha, parents: [baseSha] }),
  });

  await gh(env, base + '/git/refs/heads/' + branch, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha }),
  });

  return { sha: commit.sha, branch, files: tree.length };
}

/* ---------- routes ---------- */
function configured(env) {
  return Boolean(env.ADMIN_PASSWORD && env.SESSION_SECRET && env.GITHUB_TOKEN &&
    env.GITHUB_OWNER && env.GITHUB_REPO);
}

export async function handle(request, env, meta) {
  const diag = meta || {};
  const url = new URL(request.url);
  const route = url.pathname.replace(/^\/api\/?/, '').replace(/\/+$/, '');

  const isConfigured = configured(env);
  const authed = isConfigured
    ? Boolean(await readSession(readCookie(request, COOKIE), env.SESSION_SECRET))
    : false;

  if (route === 'session') {
    const required = ['ADMIN_PASSWORD', 'SESSION_SECRET', 'GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO'];
    const missing = isConfigured ? [] : required.filter(k => !env[k]);

    /* "All five missing" looks the same whether they were never set or the
       runtime cannot see them at all — so say which it is. */
    let hint = '';
    if (missing.length === required.length) {
      if (diag.totalEnvKeys === 0) {
        hint = 'This function cannot see any environment variables at all, which points at the runtime rather than your settings.';
      } else if (diag.totalEnvKeys > 0) {
        hint = 'This function can see ' + diag.totalEnvKeys + ' environment variables, but none of the five it needs. ' +
          'Check the names for typos, that they were added to the environment you are visiting (Production vs Preview), ' +
          'and that you redeployed afterwards — environment changes only apply to new deployments.';
      } else {
        hint = 'Set them on your host and redeploy — environment changes only apply to new deployments.';
      }
    } else if (missing.length) {
      hint = 'Set the remaining variables and redeploy.';
    }

    return json({
      mode: 'server',
      configured: isConfigured,
      authenticated: authed,
      repo: isConfigured
        ? { owner: env.GITHUB_OWNER, name: env.GITHUB_REPO, branch: env.GITHUB_BRANCH || 'main' }
        : null,
      missing,
      hint,
      /* Counts and names only — never values. */
      diagnostics: { envVarsVisible: diag.totalEnvKeys, envSource: diag.source || 'unknown' },
    });
  }

  if (route === 'login') {
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
    if (!isConfigured) return json({ error: 'Server publishing is not configured.' }, 503);
    let body;
    try { body = await request.json(); } catch (e) { return json({ error: 'Bad request' }, 400); }
    const ok = await secretsMatch(env.SESSION_SECRET, String(body.password || ''), env.ADMIN_PASSWORD);
    if (!ok) {
      /* Blunt the edge off automated guessing. Use a long random password —
         a single edge instance cannot rate-limit reliably on its own. */
      await new Promise(r => setTimeout(r, 600));
      return json({ error: 'Wrong password.' }, 401);
    }
    const token = await mintSession(env.SESSION_SECRET);
    return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(token, SESSION_DAYS * 86400) });
  }

  if (route === 'logout') {
    return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie('', 0) });
  }

  if (route === 'publish') {
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
    if (!isConfigured) return json({ error: 'Server publishing is not configured.' }, 503);
    if (!authed) return json({ error: 'Not signed in.' }, 401);

    let body;
    try { body = await request.json(); } catch (e) { return json({ error: 'Bad request' }, 400); }

    const files = body.files;
    if (!files || typeof files !== 'object') return json({ error: 'No files supplied.' }, 400);

    const paths = Object.keys(files);
    if (paths.length === 0) return json({ error: 'No files supplied.' }, 400);
    if (paths.length > MAX_FILES) return json({ error: 'Too many files.' }, 400);

    for (const p of paths) {
      if (!pathAllowed(p)) return json({ error: 'Refusing to write ' + p }, 400);
      const entry = files[p];
      const isText = typeof entry === 'string';
      const isBinary = entry && typeof entry === 'object' &&
        entry.encoding === 'base64' && typeof entry.content === 'string';
      if (!isText && !isBinary) return json({ error: 'Bad content for ' + p }, 400);
      if (isBinary && !GALLERY_RE.test(p)) {
        return json({ error: 'Only gallery images may be sent as binary: ' + p }, 400);
      }
      if (isBinary && !/^[A-Za-z0-9+/]+={0,2}$/.test(entry.content)) {
        return json({ error: 'Malformed image data for ' + p }, 400);
      }
      if (entryBytes(entry) > MAX_FILE_BYTES) return json({ error: p + ' is too large.' }, 400);
    }

    if (typeof files['content.json'] === 'string') {
      try {
        JSON.parse(files['content.json']);
      } catch (e) {
        return json({ error: 'content.json is not valid JSON.' }, 400);
      }
    }

    try {
      const result = await commitFiles(env, files, String(body.message || 'Update site content').slice(0, 200));
      return json({ ok: true, commit: result.sha, branch: result.branch, files: result.files });
    } catch (e) {
      return json({ error: e.message }, 502);
    }
  }

  return json({ error: 'Unknown route' }, 404);
}

/* exported for tests */
export const _internals = { mintSession, readSession, secretsMatch, ALLOWED_PATHS, b64utf8 };
