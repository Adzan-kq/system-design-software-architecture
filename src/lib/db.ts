import 'server-only';
import { createPrismaClient } from './prisma-client';

/**
 * Prisma singleton. In development, Next.js hot-reloads modules, which would
 * otherwise open a new connection pool on every edit.
 */
const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createPrismaClient> };

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
