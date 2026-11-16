'use client';

import { Trash2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function Button({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-danger transition hover:bg-danger-soft disabled:opacity-60"
    >
      <Trash2 className="size-4" aria-hidden />
      {pending ? 'Deleting…' : label}
    </button>
  );
}

/** Delete via a Server Action, with a confirmation prompt. */
export function DeleteButton({
  action,
  id,
  itemName,
  label = 'Delete',
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  itemName: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete “${itemName}”? This cannot be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button label={label} />
    </form>
  );
}
