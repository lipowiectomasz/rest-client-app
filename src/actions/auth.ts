'use server';

import { signIn } from '@/auth';
import { AuthError } from '@auth/core/errors';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';

export type SignState = { error: string | null };

export async function signInWithCredentials(
  _prev: SignState,
  formData: FormData,
): Promise<SignState> {
  try {
    const locale = (formData.get('locale') ?? 'en').toString();
    await signIn('credentials', formData, { redirectTo: `/${locale}/rest` });
    return { error: null };
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.type === 'CredentialsSignin') {
        return { error: 'Invalid email or password.' };
      }
      return { error: 'Authentication failed.' };
    }

    if (isRedirectError(err)) {
      redirect(`/`);
    }

    return { error: 'Unexpected error.' };
  }
}

export async function signUp(_prev: SignState, formData: FormData): Promise<SignState> {
    //TODO: rebuild after adding db
  try {
    const locale = (formData.get('locale') ?? 'en').toString();
    await signIn('credentials', formData, { redirectTo: `/${locale}/rest` });
    return { error: null };
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.type === 'CredentialsSignin') {
        return { error: 'Invalid email or password.' };
      }
      return { error: 'Authentication failed.' };
    }

    if (isRedirectError(err)) {
      redirect(`/`);
    }

    return { error: 'Unexpected error.' };
  }
}
