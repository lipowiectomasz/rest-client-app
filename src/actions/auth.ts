'use server';

import { signIn } from '@/auth';
import { AuthError } from '@auth/core/errors';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import cuid from 'cuid';
import { prisma } from '@/lib/prisma';
import { signUpSchema } from '@/lib/zod';

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
    // Extrae los datos del formulario
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    };

    // Valida los datos con Zod
    const parsed = await signUpSchema.safeParseAsync(data);

    if (!parsed.success) {
      // Retorna el primer error encontrado
      return { error: parsed.error.issues[0]?.message || 'Invalid data' };
    }

    const locale = (formData.get('locale') ?? 'en').toString();
    const email = formData.get('email')?.toString() ?? '';
    const password = formData.get('password')?.toString() ?? '';

    // Verifica si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (existingUser) {
      return { error: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
    await prisma.user.create({
      data: {
        id: cuid(),
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
      },
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
