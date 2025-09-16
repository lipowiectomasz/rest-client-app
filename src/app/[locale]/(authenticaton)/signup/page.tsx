import { Suspense } from 'react';
import SignUpForm from '@/components/login/SignUpForm';

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
