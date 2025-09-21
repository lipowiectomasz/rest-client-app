import { Suspense } from 'react';
import SignInForm from '@/components/login/SignInForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect('/');
  }
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
