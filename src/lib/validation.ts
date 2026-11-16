import { z } from 'zod';
import { MILESTONE_TYPES, STATUSES, slugify } from './format';

/** "a, b ,c" → ["a","b","c"] (deduped, empty items dropped). */
const csvList = z
  .string()
  .optional()
  .transform((v) => [...new Set((v ?? '').split(',').map((s) => s.trim()).filter(Boolean))]);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

export const moduleSchema = z
  .object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(140),
    slug: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v), 'Use lowercase letters, numbers, and dashes'),
    summary: optionalText(300),
    content: z.string().max(200_000, 'Notes are too long (200k characters max)').default(''),
    status: z.enum(STATUSES),
    pillarId: z.string().min(1, 'Choose a pillar'),
    order: z.coerce.number().int().min(0).max(100_000).default(0),
    tags: csvList,
  })
  .transform((m) => ({ ...m, slug: m.slug || slugify(m.title) }));

export const milestoneSchema = z
  .object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(160),
    type: z.enum(MILESTONE_TYPES),
    summary: z.string().trim().min(1, 'Add a short summary').max(500),
    reflection: optionalText(50_000),
    startDate: z.coerce.date({ error: 'Pick a start date' }),
    endDate: z
      .string()
      .optional()
      .transform((v) => (v ? new Date(v) : null)),
    isCurrent: z.literal('on').optional().transform(Boolean),
    featured: z.literal('on').optional().transform(Boolean),
    skills: csvList,
    linkLabel: optionalText(80),
    linkUrl: z
      .union([z.literal(''), z.url({ protocol: /^https?$/, error: 'Enter a full http(s) URL' })])
      .optional()
      .transform((v) => (v ? v : null)),
  })
  .refine((m) => !m.endDate || m.endDate >= m.startDate, { path: ['endDate'], error: 'End date must be after the start date' })
  .refine((m) => !(m.isCurrent && m.endDate), { path: ['endDate'], error: 'An ongoing milestone has no end date' })
  .refine((m) => !m.linkUrl || m.linkLabel, { path: ['linkLabel'], error: 'Add a label for the link' });

export type FieldErrors = Partial<Record<string, string[]>>;

/** Shape returned by every form Server Action (used with useActionState). */
export type FormState = {
  ok?: boolean;
  message?: string;
  errors?: FieldErrors;
  /** Raw submitted values, so the form can be re-filled after a validation error. */
  values?: Record<string, string>;
};

export function formValues(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of formData) if (typeof v === 'string' && !k.startsWith('$')) out[k] = v;
  return out;
}
