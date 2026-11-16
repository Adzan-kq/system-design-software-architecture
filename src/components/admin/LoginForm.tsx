'use client';

import { useActionState } from 'react';
import { login } from '@/actions/auth';
import { SubmitButton } from './SubmitButton';

export function LoginForm() {
  const [state, action] = useActionState(login, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          aria-invalid={state.ok === false || undefined}
          aria-describedby={state.message ? 'login-error' : undefined}
          className="field"
        />
      </div>
      {state.message && (
        <p id="login-error" role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}
      <SubmitButton className="w-full" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
