import type { ReactNode } from 'react';

/** Small shared admin building blocks (server-safe, no hooks). */

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className = '',
}: {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  error?: string[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error?.length ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-danger">
          {error[0]}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

export function Flash({ saved }: { saved?: string | string[] }) {
  const messages: Record<string, string> = { created: 'Created successfully.', deleted: 'Deleted.' };
  const msg = typeof saved === 'string' ? messages[saved] : undefined;
  if (!msg) return null;
  return (
    <p role="status" className="mb-6 rounded-xl border border-emerald-600/20 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">
      ✓ {msg}
    </p>
  );
}

export function FormMessage({ ok, message }: { ok?: boolean; message?: string }) {
  if (!message) return null;
  return (
    <p role={ok ? 'status' : 'alert'} className={`text-sm ${ok ? 'text-emerald-700 dark:text-emerald-300' : 'text-danger'}`}>
      {ok ? '✓ ' : ''}
      {message}
    </p>
  );
}
