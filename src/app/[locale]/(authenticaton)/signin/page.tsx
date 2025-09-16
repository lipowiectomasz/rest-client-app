import { Suspense } from 'react';
import SignInForm from '@/components/login/SignInForm';

export default function LoginPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
