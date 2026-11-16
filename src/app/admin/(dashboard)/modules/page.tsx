import { Pencil, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { deleteModule } from '@/actions/modules';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { StatusSelect } from '@/components/admin/StatusSelect';
import { Flash, PageHeader } from '@/components/admin/ui';
import type { ModuleStatus } from '@/generated/prisma/enums';
import { db } from '@/lib/db';
import { STATUSES, STATUS_LABEL, formatDate, readingTime } from '@/lib/format';

export const metadata: Metadata = { title: 'Modules' };

export default async function AdminModulesPage({ searchParams }: PageProps<'/admin/modules'>) {
  const sp = await searchParams;
  const pillarSlug = typeof sp.pillar === 'string' ? sp.pillar : '';
  const status = STATUSES.includes(sp.status as ModuleStatus) ? (sp.status as ModuleStatus) : undefined;
  const q = typeof sp.q === 'string' ? sp.q.trim() : '';

  const [pillars, modules] = await Promise.all([
    db.pillar.findMany({ orderBy: { order: 'asc' }, select: { id: true, slug: true, title: true } }),
    db.module.findMany({
      where: {
        ...(pillarSlug && { pillar: { slug: pillarSlug } }),
        ...(status && { status }),
        ...(q && { title: { contains: q, mode: 'insensitive' as const } }),
      },
      orderBy: [{ pillar: { order: 'asc' } }, { order: 'asc' }, { title: 'asc' }],
      include: { pillar: { select: { slug: true, title: true } } },
    }),
  ]);

  return (
    <>
      <PageHeader
        title="Modules"
        description={`${modules.length} module${modules.length === 1 ? '' : 's'}${pillarSlug || status || q ? ' matching filters' : ''}`}
        actions={
          <Link
            href={`/admin/modules/new${pillarSlug ? `?pillar=${pillarSlug}` : ''}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-contrast hover:bg-accent-hover"
          >
            <Plus className="size-4" aria-hidden /> New module
          </Link>
        }
      />
      <Flash saved={sp.saved} />

      {/* Filters (plain GET form, works without JS) */}
      <form className="mb-5 flex flex-wrap gap-2" role="search">
        <input name="q" defaultValue={q} placeholder="Search titles…" aria-label="Search titles" className="field max-w-60 py-2" />
        <select name="pillar" defaultValue={pillarSlug} aria-label="Pillar" className="field w-auto py-2">
          <option value="">All pillars</option>
          {pillars.map((p) => (
            <option key={p.id} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status ?? ''} aria-label="Status" className="field w-auto py-2">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-xl border border-line bg-card px-4 py-2 text-sm font-medium hover:text-accent">
          Filter
        </button>
        {(pillarSlug || status || q) && (
          <Link href="/admin/modules" className="self-center px-2 text-sm text-ink-muted hover:text-ink">
            Reset
          </Link>
        )}
      </form>

      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-line text-xs text-ink-subtle">
            <tr>
              <th className="px-5 py-3 font-medium">Module</th>
              <th className="px-3 py-3 font-medium">Pillar</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 text-right font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {modules.map((m) => (
              <tr key={m.id} className="transition-colors hover:bg-subtle/50">
                <td className="max-w-80 px-5 py-3">
                  <Link href={`/admin/modules/${m.id}`} className="font-medium hover:text-accent">
                    {m.title}
                  </Link>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-subtle">
                    {m.content.trim() ? `${readingTime(m.content)} min of notes` : 'No notes yet'}
                  </p>
                </td>
                <td className="px-3 py-3 text-ink-muted">{m.pillar.title}</td>
                <td className="px-3 py-3">
                  <StatusSelect key={`${m.id}-${m.status}`} id={m.id} status={m.status} title={m.title} />
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-ink-subtle">{formatDate(m.updatedAt)}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/modules/${m.id}`} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-muted hover:bg-subtle hover:text-ink">
                      <Pencil className="size-4" aria-hidden /> Edit
                    </Link>
                    <DeleteButton action={deleteModule} id={m.id} itemName={m.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modules.length === 0 && <p className="px-5 py-12 text-center text-ink-muted">No modules match these filters.</p>}
      </div>
    </>
  );
}
