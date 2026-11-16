import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';
import ws from 'ws';
import { PrismaClient } from '@/generated/prisma/client';

/**
 * Builds a PrismaClient with the right driver adapter for the connection string:
 *   - Neon (`*.neon.tech`) → @prisma/adapter-neon (serverless driver over WebSockets,
 *     ideal for serverless/edge-style deployments and Neon's pooler)
 *   - anything else (local Postgres, `prisma dev`) → @prisma/adapter-pg over TCP
 *
 * Shared by the app (src/lib/db.ts) and the seed script.
 */
export function createPrismaClient(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Copy .env.example to .env and fill in your Neon connection string.');
  }

  const isNeon = new URL(connectionString).hostname.endsWith('.neon.tech');

  if (isNeon) {
    // Node < 22 has no global WebSocket; the Neon driver needs one for Pool connections.
    if (typeof globalThis.WebSocket === 'undefined') neonConfig.webSocketConstructor = ws;
    return new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
  }

  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}
