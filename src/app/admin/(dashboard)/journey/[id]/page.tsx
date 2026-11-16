import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { deleteMilestone } from '@/actions/milestones';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { MilestoneForm } from '@/components/admin/MilestoneForm';
import { PageHeader } from '@/components/admin/ui';
import { getAdminDb } from '@/lib/admin-db';

export const metadata: Metadata = { title: 'Edit milestone' };

export default async function EditMilestonePage({ params }: PageProps<'/admin/journey/[id]'>) {
  const db = await getAdminDb();
  const { id } = await params;
  const milestone = await db.journeyMilestone.findUnique({ where: { id } });
  if (!milestone) notFound();

  return (
    <>
      <PageHeader
        title="Edit milestone"
        actions={<DeleteButton action={deleteMilestone} id={milestone.id} itemName={milestone.title} label="Delete milestone" />}
      />
      <MilestoneForm milestone={milestone} />
    </>
  );
}
