/* Reading environment variables portably.

   Vercel's Edge bundler substitutes `process.env.SOME_KEY` at build time only
   where that exact expression appears in the source. Passing `process.env`
   around as an object defeats that, and every lookup silently becomes
   undefined — so each name has to be spelled out literally below.

   Runtimes that populate process.env at runtime instead (Node, and Vercel for
   variables marked sensitive) are covered by the dynamic second pass. */

const NAMES = [
  'ADMIN_PASSWORD',
  'SESSION_SECRET',
  'GITHUB_TOKEN',
  'GITHUB_OWNER',
  'GITHUB_REPO',
  'GITHUB_BRANCH',
];

export function readEnv() {
  const env = {};

  // Pass 1 — literal accesses, so build-time substitution can see them.
  try {
    env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    env.SESSION_SECRET = process.env.SESSION_SECRET;
    env.GITHUB_TOKEN   = process.env.GITHUB_TOKEN;
    env.GITHUB_OWNER   = process.env.GITHUB_OWNER;
    env.GITHUB_REPO    = process.env.GITHUB_REPO;
    env.GITHUB_BRANCH  = process.env.GITHUB_BRANCH;
  } catch (e) { /* no process in this runtime */ }

  // Pass 2 — runtime lookup for anything still unset.
  let totalKeys = -1;
  try {
    const raw = process.env;
    totalKeys = Object.keys(raw).length;
    for (const n of NAMES) {
      if ((env[n] === undefined || env[n] === '') && raw[n]) env[n] = raw[n];
    }
  } catch (e) { /* ignore */ }

  for (const n of NAMES) if (env[n] === undefined) delete env[n];

  return { env, meta: { totalEnvKeys: totalKeys, source: 'process.env' } };
}

/* Cloudflare hands env in on the request context — a plain object, no
   build-time substitution involved. */
export function fromContext(ctxEnv) {
  const env = {};
  for (const n of NAMES) if (ctxEnv && ctxEnv[n]) env[n] = ctxEnv[n];
  let totalKeys = -1;
  try { totalKeys = Object.keys(ctxEnv || {}).length; } catch (e) { /* ignore */ }
  return { env, meta: { totalEnvKeys: totalKeys, source: 'context.env' } };
}
