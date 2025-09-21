'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import { signUp } from '@/actions/auth';
import { signUpSchema } from '@/lib/zod';
import { ZodError } from 'zod';

export default function SignUpForm() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname?.split('/')[1] || 'en';

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    try {
      signUpSchema.parse(data);
      const result = await signUp({ error: null }, formData);

      if (result.error) {
        setErrors({ general: result.error });
      } else {
        router.push(`/${locale}/rest-client`);
        router.refresh();
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<
          Record<'name' | 'email' | 'password' | 'confirmPassword', string>
        > = {};
        error.issues.forEach((issue) => {
          const key = String(issue.path[0]);
          if (
            key === 'name' ||
            key === 'email' ||
            key === 'password' ||
            key === 'confirmPassword'
          ) {
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
    <form onSubmit={handleSubmit} className="max-w-screen-lg mx-auto">
      <input type="hidden" name="locale" value={locale} />

      <div className="flex-1 rounded-lg px-6 pb-4 pt-6">
        <h1 className="mb-3 text-2xl">{t('signUp.header')}</h1>

        {/* Name */}
        <div>
          <label className="mb-3 mt-5 block text-md font-medium text-white" htmlFor="name">
            {t('common.name')}
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              name="name"
              placeholder={t('common.placeholder.name')}
              required
              className={`peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-white" />
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

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
              autoComplete="new-password"
              className={`peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 ${
                errors.password ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-white" />
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Confirm password */}
        <div className="mt-4">
          <label
            className="mb-3 mt-5 block text-md font-medium text-white"
            htmlFor="confirmPassword"
          >
            {t('common.placeholder.confirmPassword')}
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder={t('common.placeholder.confirmPassword')}
              required
              minLength={8}
              title="Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
              autoComplete="new-password"
              className={`peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-white" />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>
        {/* Submit */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 flex w-40 items-center justify-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {isLoading ? t('common.loading') : t('common.signUp')}
            {!isLoading && <ArrowRightIcon className="h-5 w-5 text-gray-50" />}
          </button>
        </div>
      </div>

      {errors.general && <p className="text-red-600 mt-2">{errors.general}</p>}
    </form>
  );
}
