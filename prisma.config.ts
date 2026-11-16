import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Prisma CLI config (migrate, studio, seed).
 *
 * Migrations need a direct (unpooled) connection: Neon's pooler (PgBouncer,
 * transaction mode) doesn't support the session features `prisma migrate` uses.
 * So the CLI uses DIRECT_URL, while the app uses the pooled DATABASE_URL via the
 * driver adapter in src/lib/db.ts.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
