'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton({
  children,
  pendingLabel = 'Saving…',
  className = '',
}: {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-contrast shadow-sm transition hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70 ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
