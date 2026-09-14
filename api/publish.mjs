/* Vercel Edge Function — thin adapter around api/_core.mjs */
import { handle } from './_core.mjs';

export const config = { runtime: 'edge' };

export default function (request) {
  return handle(request, process.env);
}
