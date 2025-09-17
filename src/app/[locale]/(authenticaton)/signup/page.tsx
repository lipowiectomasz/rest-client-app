import { Suspense } from 'react';
import SignUpForm from '@/components/login/SignUpForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function SignUpPage() {
  const session = await auth();

  if (session?.user) {
    redirect('/');
  }
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
