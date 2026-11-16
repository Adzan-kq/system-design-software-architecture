'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Prisma } from '@/generated/prisma/client';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { TAGS } from '@/lib/queries';
import { formValues, milestoneSchema, type FormState } from '@/lib/validation';

export async function createMilestone(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);
  const parsed = milestoneSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: 'Please fix the highlighted fields.', errors: z.flattenError(parsed.error).fieldErrors, values };
  }

  await db.journeyMilestone.create({ data: parsed.data });
  updateTag(TAGS.journey);
  redirect('/admin/journey?saved=created');
}

export async function updateMilestone(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);
  const parsed = milestoneSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: 'Please fix the highlighted fields.', errors: z.flattenError(parsed.error).fieldErrors, values };
  }

  try {
    await db.journeyMilestone.update({ where: { id }, data: parsed.data });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return { ok: false, message: 'This milestone no longer exists.' };
    }
    throw e;
  }
  updateTag(TAGS.journey);
  return { ok: true, message: 'Saved.', values };
}

export async function deleteMilestone(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().min(1).parse(formData.get('id'));
  await db.journeyMilestone.delete({ where: { id } }).catch((e) => {
    if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025')) throw e;
  });
  updateTag(TAGS.journey);
  redirect('/admin/journey?saved=deleted');
}
