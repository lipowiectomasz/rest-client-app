import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const VariablesPage = dynamic(() => import('../../../components/variables/VariablesPage'));

export default async function Page() {
  const session = await auth();
  if (!session) redirect('/signin');
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VariablesPage />
    </Suspense>
  );
}
