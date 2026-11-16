'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { ModuleStatus } from '@/generated/prisma/enums';
import { createModule, updateModule } from '@/actions/modules';
import { STATUSES, STATUS_LABEL, slugify } from '@/lib/format';
import type { FormState } from '@/lib/validation';
import { MarkdownEditor } from './MarkdownEditor';
import { SubmitButton } from './SubmitButton';
import { Field, FormMessage } from './ui';

export type ModuleFormData = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  status: ModuleStatus;
  pillarId: string;
  order: number;
  tags: string[];
};

/** Create/edit form for a learning module. Pass `module` to edit. */
export function ModuleForm({
  pillars,
  module,
  defaultPillarId,
}: {
  pillars: { id: string; title: string; slug: string }[];
  module?: ModuleFormData;
  defaultPillarId?: string;
}) {
  const action = module ? updateModule.bind(null, module.id) : createModule;
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  const v = state.values;
  const e = state.errors ?? {};

  const val = (key: string, fallback: string) => v?.[key] ?? fallback;
  const invalid = (key: string) => (e[key]?.length ? { 'aria-invalid': true, 'aria-describedby': `${key}-error` } : {});
  const pillar = pillars.find((p) => p.id === (v?.pillarId ?? module?.pillarId));

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      <div className="min-w-0 space-y-5">
        <Field label="Title" htmlFor="title" error={e.title}>
          <input id="title" name="title" required defaultValue={val('title', module?.title ?? '')} className="field text-base font-medium" {...invalid('title')} />
        </Field>

        <Field label="Summary" htmlFor="summary" hint="One or two sentences shown on cards and under the title." error={e.summary}>
          <textarea id="summary" name="summary" rows={2} maxLength={300} defaultValue={val('summary', module?.summary ?? '')} className="field resize-y" {...invalid('summary')} />
        </Field>

        <Field label="Study notes" htmlFor="content" error={e.content}>
          <MarkdownEditor name="content" defaultValue={val('content', module?.content ?? '')} />
        </Field>
      </div>

      {/* Settings sidebar */}
      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-5 rounded-2xl border border-line bg-card p-5">
          <Field label="Pillar" htmlFor="pillarId" error={e.pillarId}>
            <select id="pillarId" name="pillarId" required defaultValue={val('pillarId', module?.pillarId ?? defaultPillarId ?? '')} className="field" {...invalid('pillarId')}>
              <option value="" disabled>
                Choose a pillar…
              </option>
              {pillars.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </Field>

          <fieldset>
            <legend className="mb-1.5 text-sm font-medium">Status</legend>
            <div className="grid gap-1.5">
              {STATUSES.map((s) => (
                <label key={s} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line px-3 py-2 text-sm has-checked:border-accent has-checked:bg-accent-soft">
                  <input type="radio" name="status" value={s} defaultChecked={val('status', module?.status ?? 'PLANNED') === s} className="accent-[var(--color-accent)]" />
                  {STATUS_LABEL[s]}
                </label>
              ))}
            </div>
          </fieldset>

          <Field label="Slug" htmlFor="slug" hint={module ? 'Changing it changes the public URL.' : 'Leave empty to generate from the title.'} error={e.slug}>
            <input id="slug" name="slug" defaultValue={val('slug', module?.slug ?? '')} placeholder="auto-from-title" pattern="[a-z0-9]+(-[a-z0-9]+)*" className="field font-mono text-xs" {...invalid('slug')} />
          </Field>

          <div className="grid grid-cols-[1fr_5.5rem] gap-3">
            <Field label="Tags" htmlFor="tags" hint="Comma-separated" error={e.tags}>
              <input id="tags" name="tags" defaultValue={val('tags', module?.tags.join(', ') ?? '')} placeholder="caching, redis" className="field" />
            </Field>
            <Field label="Order" htmlFor="order" error={e.order}>
              <input id="order" name="order" type="number" min={0} defaultValue={val('order', String(module?.order ?? 100))} className="field" />
            </Field>
          </div>
        </div>

        <div className="space-y-3">
          <FormMessage ok={state.ok} message={state.message} />
          <SubmitButton className="w-full">{module ? 'Save changes' : 'Create module'}</SubmitButton>
          <div className="flex justify-between text-sm">
            <Link href="/admin/modules" className="text-ink-muted hover:text-ink">
              ← Back to modules
            </Link>
            {module && pillar && (
              <Link href={`/pillars/${pillar.slug}/${slugify(val('slug', module.slug)) || module.slug}`} target="_blank" className="text-accent hover:underline">
                View ↗
              </Link>
            )}
          </div>
        </div>
      </aside>
    </form>
  );
}
