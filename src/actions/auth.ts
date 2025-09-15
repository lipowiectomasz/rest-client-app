'use server';

import { signIn } from '@/auth';
import { AuthError } from '@auth/core/errors';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import cuid from 'cuid';
import { prisma } from '@/lib/prisma';

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
  try {
    const locale = (formData.get('locale') ?? 'en').toString();
    const email = formData.get('email')?.toString() ?? '';
    const password = formData.get('password')?.toString() ?? '';
    const name = formData.get('name')?.toString() ?? '';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: 'User already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { id: cuid(), email, password: hashedPassword, name },
    });

    await signIn('credentials', { email, password }, { redirectTo: `/${locale}/rest` });

    return { error: null };
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.type === 'CredentialsSignin') {
        return { error: 'Invalid email or password.' };
      }
      return { error: 'Authentication failed.' };
    }

    if (isRedirectError(err)) {
      redirect('/');
    }

    return { error: 'Unexpected error.' };
  }
}
