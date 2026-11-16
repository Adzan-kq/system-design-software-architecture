'use client';

import { useTransition } from 'react';
import type { ModuleStatus } from '@/generated/prisma/enums';
import { updateModuleStatus } from '@/actions/modules';
import { STATUSES, STATUS_LABEL } from '@/lib/format';

const TONE: Record<ModuleStatus, string> = {
  COMPLETED: 'text-emerald-700 dark:text-emerald-300',
  IN_PROGRESS: 'text-amber-700 dark:text-amber-300',
  PLANNED: 'text-ink-muted',
};

/** Inline status changer for the module table; saves on change. */
export function StatusSelect({ id, status, title }: { id: string; status: ModuleStatus; title: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <select
      aria-label={`Status of ${title}`}
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const fd = new FormData();
        fd.set('id', id);
        fd.set('status', e.target.value);
        startTransition(() => updateModuleStatus(fd));
      }}
      className={`rounded-lg border border-line bg-card px-2 py-1 text-xs font-medium disabled:opacity-60 ${TONE[status]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
