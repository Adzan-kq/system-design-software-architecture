import { Pencil, Plus, Star } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { deleteMilestone } from '@/actions/milestones';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { Flash, PageHeader } from '@/components/admin/ui';
import { db } from '@/lib/db';
import { MILESTONE_TYPE_LABEL, formatRange } from '@/lib/format';

export const metadata: Metadata = { title: 'Journey' };

export default async function AdminJourneyPage({ searchParams }: PageProps<'/admin/journey'>) {
  const { saved } = await searchParams;
  const milestones = await db.journeyMilestone.findMany({ orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }] });

  return (
    <>
      <PageHeader
        title="Journey milestones"
        description="Career evolution, milestones, and shipped projects shown on the public timeline."
        actions={
          <Link href="/admin/journey/new" className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-contrast hover:bg-accent-hover">
            <Plus className="size-4" aria-hidden /> Add milestone
          </Link>
        }
      />
      <Flash saved={saved} />

      <ul className="space-y-3">
        {milestones.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-card p-5">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-subtle">
                <span className="rounded-md bg-subtle px-2 py-0.5 font-mono font-medium text-ink-muted">{MILESTONE_TYPE_LABEL[m.type]}</span>
                <span className="font-mono">{formatRange(m.startDate, m.endDate, m.isCurrent)}</span>
                {m.isCurrent && <span className="font-medium text-accent">● Now</span>}
                {m.featured && (
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-300">
                    <Star className="size-3" aria-hidden /> Featured
                  </span>
                )}
              </div>
              <Link href={`/admin/journey/${m.id}`} className="mt-1.5 block font-bold hover:text-accent">
                {m.title}
              </Link>
              <p className="mt-0.5 line-clamp-1 text-sm text-ink-muted">{m.summary}</p>
            </div>
            <div className="flex gap-1">
              <Link href={`/admin/journey/${m.id}`} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-muted hover:bg-subtle hover:text-ink">
                <Pencil className="size-4" aria-hidden /> Edit
              </Link>
              <DeleteButton action={deleteMilestone} id={m.id} itemName={m.title} />
            </div>
          </li>
        ))}
      </ul>
      {milestones.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-ink-muted">No milestones yet. Add your first one.</p>
      )}
    </>
  );
}
