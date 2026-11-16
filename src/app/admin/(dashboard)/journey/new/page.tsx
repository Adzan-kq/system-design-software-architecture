import type { Metadata } from 'next';
import { MilestoneForm } from '@/components/admin/MilestoneForm';
import { PageHeader } from '@/components/admin/ui';

export const metadata: Metadata = { title: 'New milestone' };

export default function NewMilestonePage() {
  return (
    <>
      <PageHeader title="Add milestone" description="A career step, learning phase, shipped project, or certification." />
      <MilestoneForm />
    </>
  );
}
