import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = { title: 'Admin login', robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="grid flex-1 place-items-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-display text-xl font-extrabold">
          <span className="grid size-9 place-items-center rounded-xl bg-accent text-accent-contrast">A</span>
          Adzan<span className="-ml-2 text-accent">.dev</span>
        </Link>
        <div className="rounded-2xl border border-line bg-card p-7 shadow-sm">
          <h1 className="text-xl font-bold">Admin sign in</h1>
          <p className="mt-1 mb-6 text-sm text-ink-muted">Manage learning modules and journey milestones.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
