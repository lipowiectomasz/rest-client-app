'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/16/solid';
import { signInSchema } from '@/lib/zod';
import { ZodError } from 'zod';

export default function SignInForm() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      signInSchema.parse({ email, password });

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrors({ general: 'Invalid email or password' });
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<'email' | 'password', string>> = {};
        error.issues.forEach((issue) => {
          const key = issue.path[0];
          if (key === 'email' || key === 'password') {
            fieldErrors[key] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: 'An unexpected error occurred' });
        console.warn(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="max-w-screen-lg mx-auto" onSubmit={handleSubmit}>
      <div className="flex-1 rounded-lg px-6 pb-4 pt-6">
        <h1 className="mb-3 text-2xl">{t('signIn.header')}</h1>

        {/* Email */}
        <div>
          <label className="mb-3 mt-5 block text-md font-medium text-white" htmlFor="email">
            {t('common.email')}
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              name="email"
              placeholder={t('common.placeholder.email')}
              required
              className={`peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-white" />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="mb-3 mt-5 block text-md font-medium text-white" htmlFor="password">
            {t('common.password')}
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              name="password"
              placeholder={t('common.placeholder.password')}
              required
              minLength={8}
              title="Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
              className={`peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 ${
                errors.password ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-white" />
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div className="mt-8">
          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 flex w-40 items-center justify-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {isLoading ? t('common.loading') : t('common.signIn')}
            {!isLoading && <ArrowRightIcon className="h-5 w-5 text-gray-50" />}
          </button>
        </div>
      </div>

      {errors.general && <p className="text-red-600 mt-2">{errors.general}</p>}
    </form>
  );
}
