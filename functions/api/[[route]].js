/* Cloudflare Pages Function — thin adapter around api/_core.mjs.
   The [[route]] catch-all handles /api/session, /api/login, /api/logout
   and /api/publish. */
import { handle } from '../../api/_core.mjs';

export async function onRequest(context) {
  return handle(context.request, context.env);
}
