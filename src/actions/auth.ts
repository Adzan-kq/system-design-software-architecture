'use server';

import { redirect } from 'next/navigation';
import { endSession, passwordMatches, startSession } from '@/lib/auth';
import type { FormState } from '@/lib/validation';

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get('password') ?? '');

  if (!password || !passwordMatches(password)) {
    // Slow down brute-force attempts. Best-effort only: for real rate limiting
    // across serverless instances, use a shared store (e.g. Upstash Redis).
    await new Promise((r) => setTimeout(r, 800));
    return { ok: false, message: 'Incorrect password.' };
  }

  await startSession();
  redirect('/admin');
}

export async function logout(): Promise<void> {
  await endSession();
  redirect('/admin/login');
}
