import { CheckCircle2, CircleDashed, Layers, Loader, Plus } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/admin/ui';
import { PillarIcon } from '@/components/site/PillarIcon';
import { ProgressBar } from '@/components/site/ProgressBar';
import { StatusBadge } from '@/components/site/StatusBadge';
import { getAdminDb } from '@/lib/admin-db';
import { formatDate, percent } from '@/lib/format';

// Admin reads are uncached on purpose: always live from Neon.
export default async function AdminOverviewPage() {
  const db = await getAdminDb();
  const [byStatus, pillars, recent, milestoneCount] = await Promise.all([
    db.module.groupBy({ by: ['status'], _count: { _all: true } }),
    db.pillar.findMany({
      orderBy: { order: 'asc' },
      select: { id: true, slug: true, title: true, modules: { select: { status: true } } },
    }),
    db.module.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 8,
      select: { id: true, title: true, status: true, updatedAt: true, pillar: { select: { title: true } } },
    }),
    db.journeyMilestone.count(),
  ]);

  const count = (s: string) => byStatus.find((b) => b.status === s)?._count._all ?? 0;
  const total = byStatus.reduce((n, b) => n + b._count._all, 0);
  const completed = count('COMPLETED');

  const cards = [
    { label: 'Total modules', value: total, icon: Layers, tone: 'text-accent bg-accent-soft' },
    { label: 'Completed', value: completed, icon: CheckCircle2, tone: 'text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-400/10' },
    { label: 'In progress', value: count('IN_PROGRESS'), icon: Loader, tone: 'text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-400/10' },
    { label: 'Planned', value: count('PLANNED'), icon: CircleDashed, tone: 'text-ink-muted bg-subtle' },
  ];

  return (
    <>
      <PageHeader
        title="Overview"
        description={`${percent(completed, total)}% of all modules completed · ${milestoneCount} journey milestones`}
        actions={
          <Link href="/admin/modules/new" className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-contrast hover:bg-accent-hover">
            <Plus className="size-4" aria-hidden /> New module
          </Link>
        }
      />

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-line bg-card p-5">
            <span className={`grid size-9 place-items-center rounded-xl ${tone}`}>
              <Icon className="size-4.5" aria-hidden />
            </span>
            <dt className="mt-4 text-sm text-ink-muted">{label}</dt>
            <dd className="font-display text-3xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section className="rounded-2xl border border-line bg-card p-6">
          <h2 className="mb-5 font-bold">Progress by pillar</h2>
          <ul className="space-y-5">
            {pillars.map((p) => {
              const done = p.modules.filter((m) => m.status === 'COMPLETED').length;
              const pct = percent(done, p.modules.length);
              return (
                <li key={p.id}>
                  <Link href={`/admin/modules?pillar=${p.slug}`} className="group block">
                    <div className="mb-2 flex items-center gap-3 text-sm">
                      <PillarIcon slug={p.slug} className="size-4 text-accent" />
                      <span className="flex-1 font-medium group-hover:text-accent">{p.title}</span>
                      <span className="font-mono text-xs text-ink-subtle">
                        {done}/{p.modules.length} · {pct}%
                      </span>
                    </div>
                    <ProgressBar value={pct} label={`${p.title} progress`} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-card p-6">
          <h2 className="mb-4 font-bold">Recent updates</h2>
          <ul className="divide-y divide-line">
            {recent.map((m) => (
              <li key={m.id}>
                <Link href={`/admin/modules/${m.id}`} className="group block py-3">
                  <p className="truncate text-sm font-medium group-hover:text-accent">{m.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-ink-subtle">
                    <StatusBadge status={m.status} size="sm" />
                    <span className="truncate">{formatDate(m.updatedAt)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
