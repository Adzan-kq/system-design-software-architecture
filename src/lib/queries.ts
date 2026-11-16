import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { db } from './db';
import { percent, readingTime } from './format';
import { renderMarkdown } from './markdown';

/**
 * Public read model. Every function is cached ('use cache') and tagged, so
 * pages are served without hitting Neon on each request. Server Actions call
 * `updateTag(TAGS.x)` after a mutation for instant read-your-own-writes.
 */
export const TAGS = {
  pillars: 'pillars',
  modules: 'modules',
  journey: 'journey',
} as const;

export type PillarSummary = Awaited<ReturnType<typeof getPillarsWithStats>>[number];

export async function getPillarsWithStats() {
  'use cache';
  cacheLife('hours');
  cacheTag(TAGS.pillars, TAGS.modules);

  const pillars = await db.pillar.findMany({
    orderBy: { order: 'asc' },
    include: { modules: { select: { status: true } } },
  });

  return pillars.map(({ modules, ...p }) => {
    const completed = modules.filter((m) => m.status === 'COMPLETED').length;
    const inProgress = modules.filter((m) => m.status === 'IN_PROGRESS').length;
    return {
      ...p,
      total: modules.length,
      completed,
      inProgress,
      planned: modules.length - completed - inProgress,
      percent: percent(completed, modules.length),
    };
  });
}

export function overallStats(pillars: PillarSummary[]) {
  const total = pillars.reduce((n, p) => n + p.total, 0);
  const completed = pillars.reduce((n, p) => n + p.completed, 0);
  const inProgress = pillars.reduce((n, p) => n + p.inProgress, 0);
  return { total, completed, inProgress, planned: total - completed - inProgress, percent: percent(completed, total) };
}

export async function getPillarSlugs() {
  'use cache';
  cacheLife('hours');
  cacheTag(TAGS.pillars);
  return db.pillar.findMany({ select: { slug: true }, orderBy: { order: 'asc' } });
}

export async function getPillarWithModules(slug: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(TAGS.pillars, TAGS.modules);

  const pillar = await db.pillar.findUnique({
    where: { slug },
    include: { modules: { orderBy: [{ order: 'asc' }, { title: 'asc' }] } },
  });
  if (!pillar) return null;

  // Don't ship full note bodies to the list page; just what the cards need.
  const modules = pillar.modules.map(({ content, ...m }) => ({
    ...m,
    readingTime: readingTime(content),
    hasNotes: content.trim().length > 0,
  }));
  const completed = modules.filter((m) => m.status === 'COMPLETED').length;
  return { ...pillar, modules, completed, percent: percent(completed, modules.length) };
}

export async function getModuleSlugs() {
  'use cache';
  cacheLife('hours');
  cacheTag(TAGS.modules);
  const modules = await db.module.findMany({ select: { slug: true, pillar: { select: { slug: true } } } });
  return modules.map((m) => ({ slug: m.pillar.slug, module: m.slug }));
}

/** A module with its notes rendered to HTML (rendering is cached too). */
export async function getModulePage(pillarSlug: string, moduleSlug: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(TAGS.modules);

  const mod = await db.module.findFirst({
    where: { slug: moduleSlug, pillar: { slug: pillarSlug } },
    include: { pillar: { select: { slug: true, title: true } } },
  });
  if (!mod) return null;

  const siblings = await db.module.findMany({
    where: { pillarId: mod.pillarId },
    orderBy: [{ order: 'asc' }, { title: 'asc' }],
    select: { slug: true, title: true, status: true },
  });
  const i = siblings.findIndex((s) => s.slug === mod.slug);
  const { html, headings } = await renderMarkdown(mod.content);

  return {
    module: mod,
    html,
    headings,
    readingTime: readingTime(mod.content),
    siblings,
    prev: siblings[i - 1] ?? null,
    next: siblings[i + 1] ?? null,
  };
}

export async function getRecentlyUpdatedModules(limit = 4) {
  'use cache';
  cacheLife('hours');
  cacheTag(TAGS.modules);

  const modules = await db.module.findMany({
    where: { status: { not: 'PLANNED' } },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    include: { pillar: { select: { slug: true, title: true } } },
  });
  return modules.map(({ content, ...m }) => ({ ...m, readingTime: readingTime(content) }));
}

export async function getJourney({ featuredOnly = false } = {}) {
  'use cache';
  cacheLife('hours');
  cacheTag(TAGS.journey);

  const milestones = await db.journeyMilestone.findMany({
    where: featuredOnly ? { featured: true } : undefined,
    orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }, { createdAt: 'desc' }],
  });
  return Promise.all(
    milestones.map(async (m) => ({
      ...m,
      reflectionHtml: m.reflection ? (await renderMarkdown(m.reflection)).html : null,
    })),
  );
}
