/* Cloudflare Pages Function — thin adapter around api/_core.mjs.
   The [[route]] catch-all handles /api/session, /api/login, /api/logout
   and /api/publish. */
import { handle } from '../../api/_core.mjs';
import { fromContext } from '../../api/_env.mjs';

export async function onRequest(context) {
  const { env, meta } = fromContext(context.env);
  return handle(context.request, env, meta);
}
