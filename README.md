# Adzan.dev: Engineering Learning Hub

Personal learning hub and developer-journey platform with an admin dashboard.

**Stack:** Next.js 16 (App Router, Cache Components, Server Actions) · Neon Serverless PostgreSQL · Prisma 7 · Tailwind CSS v4 · Shiki · Mermaid · Bun (package manager)

## Setup (WSL / Linux)

Requires [Bun](https://bun.com) (`curl -fsSL https://bun.com/install | bash`) and Node.js 20.9+ (Next.js runs on Node).

```bash
# 1. Install (also generates the Prisma client via postinstall)
bun install

# 2. Configure environment
cp .env.example .env
#    → paste your Neon pooled + direct connection strings
#    → set ADMIN_PASSWORD and SESSION_SECRET (openssl rand -base64 32)

# 3. Create tables on Neon and seed the 6 pillars + initial modules
bun run db:deploy      # applies prisma/migrations (uses DIRECT_URL)
bun run db:seed        # idempotent; never overwrites your edits

# 4. Run
bun run dev            # http://localhost:3000   ·   admin: /admin
```

Changing the schema later: edit `prisma/schema.prisma`, then `bun run db:migrate --name <change>`.

## How it fits together

| Concern | Where |
| --- | --- |
| Schema (Pillar, Module, JourneyMilestone) | `prisma/schema.prisma` |
| Seed (6 pillars, 39 modules, first milestones) | `prisma/seed.ts` |
| Neon connection (pooled, driver adapter) | `src/lib/prisma-client.ts`, `src/lib/db.ts` |
| Migrations connection (direct) | `prisma.config.ts` |
| Public reads (`'use cache'` + tags) | `src/lib/queries.ts` |
| Mutations (Server Actions, Zod-validated, admin-only) | `src/actions/*.ts` |
| Auth (signed HTTP-only cookie) | `src/lib/auth.ts`, `src/lib/session-token.ts`, `src/proxy.ts` |
| Markdown → HTML (GFM, Shiki, Mermaid, TOC) | `src/lib/markdown.ts` |

**Caching:** public pages are prerendered from cached queries (`cacheLife('hours')`), so Neon is not hit on every visit and can scale to zero. Every Server Action calls `updateTag(...)`, so admin edits show up on the public site immediately.

**Auth:** `proxy.ts` redirects unauthenticated `/admin` requests early. The real checks are `requireAdmin()` in the admin layout and at the top of **every** Server Action, since actions can be called directly.

**Neon URLs:** Prisma 7 no longer accepts `url`/`directUrl` in `schema.prisma`. The CLI uses `DIRECT_URL` via `prisma.config.ts`. The app uses the pooled `DATABASE_URL` through `@prisma/adapter-neon`. Non-Neon URLs (local Postgres) automatically use `@prisma/adapter-pg`.

## Deploying (Vercel)

`vercel.json` pins the framework to Next.js and makes Vercel install and build with Bun (`bun install --frozen-lockfile`, `bun run build`). The app itself runs on Vercel's Node.js runtime.

Set `DATABASE_URL`, `DIRECT_URL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` in the project settings. The build prerenders pages from the database, so the database must be reachable at build time. Run `bun run db:deploy` when migrations change (locally against Neon, or as a build step).
