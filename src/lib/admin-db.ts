import 'server-only';
import { requireAdmin } from './auth';
import { db } from './db';

/**
 * The only way admin pages should reach the database.
 *
 * Next.js renders a layout and its page in parallel, so the auth check in the
 * admin layout does NOT run before a page's own queries. Gating access here
 * guarantees that every admin query:
 *   1. runs only for a verified admin session, and
 *   2. happens after a request-time API (cookies), so Next never tries to
 *      prerender it at build time. (Prerendering a Neon query fails: the
 *      driver's SCRAM auth calls crypto.randomBytes, which Next rejects.)
 */
export async function getAdminDb() {
  await requireAdmin();
  return db;
}
