import type { ModuleStatus } from '@/generated/prisma/enums';
import { STATUS_LABEL } from '@/lib/format';

const STYLES: Record<ModuleStatus, string> = {
  COMPLETED:
    'bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 ring-amber-600/15 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20',
  PLANNED: 'bg-subtle text-ink-muted ring-line',
};

export function StatusBadge({ status, size = 'md' }: { status: ModuleStatus; size?: 'sm' | 'md' }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full font-medium ring-1 ring-inset ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs'
      } ${STYLES[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}
