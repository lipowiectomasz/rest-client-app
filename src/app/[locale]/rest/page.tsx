import { auth } from '@/auth';

export default async function RestPage() {
  const session = await auth();

  console.log('session', session);

  if (!session) return null;

  return (
    <>
      Rest site
      {session.user?.email}
    </>
  );
}
