import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl flex-1 px-4 py-32 text-center">
      <p className="font-mono text-sm font-medium text-accent">404</p>
      <h1 className="mt-3 text-4xl font-extrabold text-ink">This page hasn&apos;t sprouted yet 🌱</h1>
      <p className="mt-4 text-ink-muted">The page you&apos;re looking for doesn&apos;t exist, or it&apos;s still a seed in the garden.</p>
      <Link href="/" className="mt-9 inline-block rounded-xl bg-accent px-5 py-3 font-medium text-accent-contrast transition hover:bg-accent-hover">
        Back home
      </Link>
    </main>
  );
}
