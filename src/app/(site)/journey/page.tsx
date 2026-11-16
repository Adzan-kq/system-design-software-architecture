import type { Metadata } from 'next';
import { JourneyTimeline } from '@/components/site/JourneyTimeline';
import { SectionHeading } from '@/components/site/SectionHeading';
import { getJourney } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Developer Journey',
  description: 'Career evolution, key milestones, and shipped projects.',
};

export default async function JourneyPage() {
  const milestones = await getJourney();
  const skills = new Set(milestones.flatMap((m) => m.skills));
  const since = milestones.length ? Math.min(...milestones.map((m) => m.startDate.getUTCFullYear())) : null;

  const stats = [
    { label: 'Milestones', value: milestones.length },
    { label: 'Skills picked up', value: skills.size },
    ...(since ? [{ label: 'Learning since', value: since }] : []),
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow="git log --reverse"
        title="Developer Journey"
        description="My career evolution, key milestones, and shipped projects, with short reflections on what each one taught me."
      />
      <dl className="mb-12 grid grid-cols-3 gap-3 sm:max-w-lg">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-card px-4 py-3">
            <dt className="text-xs text-ink-subtle">{s.label}</dt>
            <dd className="mt-0.5 font-display text-2xl font-bold text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>
      <JourneyTimeline milestones={milestones} />
    </main>
  );
}
