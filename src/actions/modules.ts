'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Prisma } from '@/generated/prisma/client';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { STATUSES } from '@/lib/format';
import { renderMarkdown, type RenderedMarkdown } from '@/lib/markdown';
import { TAGS } from '@/lib/queries';
import { formValues, moduleSchema, type FormState } from '@/lib/validation';

/** Status transitions keep completedAt in sync. */
function completedAtFor(status: string, previous?: { status: string; completedAt: Date | null }) {
  if (status !== 'COMPLETED') return null;
  return previous?.status === 'COMPLETED' ? previous.completedAt : new Date();
}

function invalidate() {
  updateTag(TAGS.modules);
  updateTag(TAGS.pillars);
}

function uniqueSlugError(e: unknown, values: Record<string, string>): FormState | null {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
    return {
      ok: false,
      message: 'A module with this slug already exists in this pillar.',
      errors: { slug: ['Slug must be unique within the pillar'] },
      values,
    };
  }
  return null;
}

export async function createModule(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);
  const parsed = moduleSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: 'Please fix the highlighted fields.', errors: z.flattenError(parsed.error).fieldErrors, values };
  }

  try {
    await db.module.create({ data: { ...parsed.data, completedAt: completedAtFor(parsed.data.status) } });
  } catch (e) {
    const err = uniqueSlugError(e, values);
    if (err) return err;
    throw e;
  }

  invalidate();
  redirect('/admin/modules?saved=created');
}

export async function updateModule(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);
  const parsed = moduleSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: 'Please fix the highlighted fields.', errors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const previous = await db.module.findUnique({ where: { id }, select: { status: true, completedAt: true } });
  if (!previous) return { ok: false, message: 'This module no longer exists.' };

  try {
    await db.module.update({
      where: { id },
      data: { ...parsed.data, completedAt: completedAtFor(parsed.data.status, previous) },
    });
  } catch (e) {
    const err = uniqueSlugError(e, values);
    if (err) return err;
    throw e;
  }

  invalidate();
  return { ok: true, message: 'Saved.', values };
}

/** Quick status change from the module list. */
export async function updateModuleStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const { id, status } = z.object({ id: z.string().min(1), status: z.enum(STATUSES) }).parse(Object.fromEntries(formData));

  const previous = await db.module.findUnique({ where: { id }, select: { status: true, completedAt: true } });
  if (!previous) return;
  await db.module.update({ where: { id }, data: { status, completedAt: completedAtFor(status, previous) } });
  invalidate();
}

export async function deleteModule(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().min(1).parse(formData.get('id'));
  await db.module.delete({ where: { id } }).catch((e) => {
    // Already deleted (e.g. double submit): nothing to do.
    if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025')) throw e;
  });
  invalidate();
  redirect('/admin/modules?saved=deleted');
}

/** Live preview for the Markdown editor; same pipeline as the public page. */
export async function previewMarkdown(markdown: string): Promise<RenderedMarkdown> {
  await requireAdmin();
  return renderMarkdown(markdown.slice(0, 200_000));
}
