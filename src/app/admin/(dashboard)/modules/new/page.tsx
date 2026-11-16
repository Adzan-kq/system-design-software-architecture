import type { Metadata } from 'next';
import { ModuleForm } from '@/components/admin/ModuleForm';
import { PageHeader } from '@/components/admin/ui';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'New module' };

export default async function NewModulePage({ searchParams }: PageProps<'/admin/modules/new'>) {
  const { pillar } = await searchParams;
  const pillars = await db.pillar.findMany({ orderBy: { order: 'asc' }, select: { id: true, slug: true, title: true } });
  const defaultPillarId = pillars.find((p) => p.slug === pillar)?.id;

  return (
    <>
      <PageHeader title="New module" description="Add a learning module to one of the six pillars." />
      <ModuleForm pillars={pillars} defaultPillarId={defaultPillarId} />
    </>
  );
}
