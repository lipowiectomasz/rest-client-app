import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function RestPage() {
  const session = await auth();

  // if (!session) return null;
  if (!session) {
    redirect('/signin');
  }

  return (
    <>
      Rest site
      {session.user?.email}
    </>
  );
}
