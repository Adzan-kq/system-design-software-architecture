import type { MilestoneType, ModuleStatus } from '@/generated/prisma/enums';

export const STATUS_LABEL: Record<ModuleStatus, string> = {
  PLANNED: 'Planned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export const STATUSES = ['PLANNED', 'IN_PROGRESS', 'COMPLETED'] as const satisfies readonly ModuleStatus[];

export const MILESTONE_TYPE_LABEL: Record<MilestoneType, string> = {
  CAREER: 'Career',
  LEARNING: 'Learning',
  PROJECT: 'Project',
  CERTIFICATION: 'Certification',
  MILESTONE: 'Milestone',
};

export const MILESTONE_TYPES = ['CAREER', 'LEARNING', 'PROJECT', 'CERTIFICATION', 'MILESTONE'] as const satisfies readonly MilestoneType[];

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Minutes to read: ~200 wpm for prose plus ~10 s per line of code/diagram. */
export function readingTime(markdown: string): number {
  if (!markdown.trim()) return 0;
  const fences = markdown.match(/```[\s\S]*?```/g) ?? [];
  const codeLines = fences.reduce((n, block) => n + block.split('\n').length, 0);
  const words = markdown.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200 + codeLines / 6));
}

export function percent(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const fullDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });

export const formatDate = (d: Date) => fullDate.format(d);

export function formatRange(start: Date, end: Date | null, isCurrent: boolean): string {
  if (isCurrent) return `${monthYear.format(start)} — Present`;
  if (end) return `${monthYear.format(start)} — ${monthYear.format(end)}`;
  return monthYear.format(start);
}

/** `YYYY-MM-DD` for <input type="date"> values. */
export const toDateInput = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : '');
