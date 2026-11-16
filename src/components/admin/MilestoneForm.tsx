'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { MilestoneType } from '@/generated/prisma/enums';
import { createMilestone, updateMilestone } from '@/actions/milestones';
import { MILESTONE_TYPES, MILESTONE_TYPE_LABEL, toDateInput } from '@/lib/format';
import type { FormState } from '@/lib/validation';
import { MarkdownEditor } from './MarkdownEditor';
import { SubmitButton } from './SubmitButton';
import { Field, FormMessage } from './ui';

export type MilestoneFormData = {
  id: string;
  title: string;
  type: MilestoneType;
  summary: string;
  reflection: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  featured: boolean;
  skills: string[];
  linkLabel: string | null;
  linkUrl: string | null;
};

export function MilestoneForm({ milestone }: { milestone?: MilestoneFormData }) {
  const action = milestone ? updateMilestone.bind(null, milestone.id) : createMilestone;
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  const v = state.values;
  const e = state.errors ?? {};
  const val = (key: string, fallback: string) => v?.[key] ?? fallback;
  const checked = (key: string, fallback: boolean) => (v ? v[key] === 'on' : fallback);
  const invalid = (key: string) => (e[key]?.length ? { 'aria-invalid': true, 'aria-describedby': `${key}-error` } : {});

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      <div className="min-w-0 space-y-5">
        <Field label="Title" htmlFor="title" error={e.title}>
          <input id="title" name="title" required defaultValue={val('title', milestone?.title ?? '')} className="field text-base font-medium" {...invalid('title')} />
        </Field>
        <Field label="Summary" htmlFor="summary" hint="Shown on the timeline card." error={e.summary}>
          <textarea id="summary" name="summary" rows={3} required maxLength={500} defaultValue={val('summary', milestone?.summary ?? '')} className="field resize-y" {...invalid('summary')} />
        </Field>
        <Field label="Reflection (optional)" htmlFor="reflection" hint="What you learned, what was hard, what you'd do differently. Shown under “Read the reflection”." error={e.reflection}>
          <MarkdownEditor name="reflection" defaultValue={val('reflection', milestone?.reflection ?? '')} />
        </Field>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-5 rounded-2xl border border-line bg-card p-5">
          <Field label="Type" htmlFor="type" error={e.type}>
            <select id="type" name="type" defaultValue={val('type', milestone?.type ?? 'LEARNING')} className="field">
              {MILESTONE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {MILESTONE_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start" htmlFor="startDate" error={e.startDate}>
              <input id="startDate" name="startDate" type="date" required defaultValue={val('startDate', toDateInput(milestone?.startDate))} className="field px-2.5" {...invalid('startDate')} />
            </Field>
            <Field label="End" htmlFor="endDate" error={e.endDate}>
              <input id="endDate" name="endDate" type="date" defaultValue={val('endDate', toDateInput(milestone?.endDate))} className="field px-2.5" {...invalid('endDate')} />
            </Field>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 text-sm">
              <input type="checkbox" name="isCurrent" defaultChecked={checked('isCurrent', milestone?.isCurrent ?? false)} className="size-4 accent-[var(--color-accent)]" />
              Ongoing (shows “Now”)
            </label>
            <label className="flex items-center gap-2.5 text-sm">
              <input type="checkbox" name="featured" defaultChecked={checked('featured', milestone?.featured ?? false)} className="size-4 accent-[var(--color-accent)]" />
              Feature on home page
            </label>
          </div>
          <Field label="Skills" htmlFor="skills" hint="Comma-separated" error={e.skills}>
            <input id="skills" name="skills" defaultValue={val('skills', milestone?.skills.join(', ') ?? '')} placeholder="Kafka, Go" className="field" />
          </Field>
          <Field label="Link label" htmlFor="linkLabel" error={e.linkLabel}>
            <input id="linkLabel" name="linkLabel" defaultValue={val('linkLabel', milestone?.linkLabel ?? '')} placeholder="Source on GitHub" className="field" {...invalid('linkLabel')} />
          </Field>
          <Field label="Link URL" htmlFor="linkUrl" error={e.linkUrl}>
            <input id="linkUrl" name="linkUrl" type="url" defaultValue={val('linkUrl', milestone?.linkUrl ?? '')} placeholder="https://" className="field" {...invalid('linkUrl')} />
          </Field>
        </div>
        <div className="space-y-3">
          <FormMessage ok={state.ok} message={state.message} />
          <SubmitButton className="w-full">{milestone ? 'Save changes' : 'Add milestone'}</SubmitButton>
          <Link href="/admin/journey" className="block text-sm text-ink-muted hover:text-ink">
            ← Back to journey
          </Link>
        </div>
      </aside>
    </form>
  );
}
