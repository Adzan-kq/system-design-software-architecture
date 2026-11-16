import { ExternalLink, LogOut } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense, type ReactNode } from 'react';
import { logout } from '@/actions/auth';
import { AdminNav } from '@/components/admin/AdminNav';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: { default: 'Admin', template: '%s · Admin · Adzan.dev' }, robots: { index: false, follow: false } };

/** Verifies the session cookie before rendering any admin page. */
async function AdminGate({ children }: { children: ReactNode }) {
  await requireAdmin();
  return children;
}

function Skeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-subtle" />
      <div className="grid gap-4 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-subtle" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-subtle" />
    </div>
  );
}

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href="/admin" className="flex shrink-0 items-center gap-2 font-display font-extrabold">
            <span className="grid size-8 place-items-center rounded-xl bg-accent text-sm text-accent-contrast">A</span>
            <span className="hidden sm:inline">Admin</span>
          </Link>
          <Suspense>
            <AdminNav />
          </Suspense>
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <Link href="/" target="_blank" className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-ink-muted hover:bg-subtle hover:text-ink sm:inline-flex">
              View site <ExternalLink className="size-3.5" aria-hidden />
            </Link>
            <ThemeToggle />
            <form action={logout}>
              <button type="submit" aria-label="Sign out" className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-subtle hover:text-ink">
                <LogOut className="size-4.5" aria-hidden />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Suspense fallback={<Skeleton />}>
          <AdminGate>{children}</AdminGate>
        </Suspense>
      </main>
    </>
  );
}
