/* Vercel Edge Function — thin adapter around api/_core.mjs */
import { handle } from './_core.mjs';
import { readEnv } from './_env.mjs';

export const config = { runtime: 'edge' };

export default function (request) {
  const { env, meta } = readEnv();
  return handle(request, env, meta);
}
