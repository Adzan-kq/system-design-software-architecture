import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { deleteModule } from '@/actions/modules';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { ModuleForm } from '@/components/admin/ModuleForm';
import { PageHeader } from '@/components/admin/ui';
import { getAdminDb } from '@/lib/admin-db';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Edit module' };

export default async function EditModulePage({ params }: PageProps<'/admin/modules/[id]'>) {
  const db = await getAdminDb();
  const { id } = await params;
  const [module, pillars] = await Promise.all([
    db.module.findUnique({ where: { id } }),
    db.pillar.findMany({ orderBy: { order: 'asc' }, select: { id: true, slug: true, title: true } }),
  ]);
  if (!module) notFound();

  return (
    <>
      <PageHeader
        title="Edit module"
        description={`Last updated ${formatDate(module.updatedAt)}${module.completedAt ? ` · completed ${formatDate(module.completedAt)}` : ''}`}
        actions={<DeleteButton action={deleteModule} id={module.id} itemName={module.title} label="Delete module" />}
      />
      <ModuleForm pillars={pillars} module={module} />
    </>
  );
}
