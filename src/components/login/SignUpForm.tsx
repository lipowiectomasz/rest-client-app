'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/16/solid';
import { useActionState, useRef } from 'react';
import { signUp } from '@/actions/auth';
import { PASSWORD_PATTERN } from '@/lib/regex';
export default function SignUpForm() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  const [state, formAction] = useActionState(signUp, { error: null });

  // refs para validar contraseña
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (
      passwordRef.current &&
      confirmPasswordRef.current &&
      passwordRef.current.value !== confirmPasswordRef.current.value
    ) {
      e.preventDefault();
      alert(t('common.passwordsDoNotMatch') || 'Passwords do not match');
      return false;
    }
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="max-w-screen-lg mx-auto">
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
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-white" />
          </div>
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
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-white" />
          </div>
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
              ref={passwordRef}
              pattern={PASSWORD_PATTERN}
              title="Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
              autoComplete="new-password"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-white" />
          </div>
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
              ref={confirmPasswordRef}
              pattern={PASSWORD_PATTERN}
              title="Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
              autoComplete="new-password"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-white" />
          </div>
        </div>
        {/* Submit */}
        <div className="mt-8">
          <button className="mt-4 flex w-40 items-center justify-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
            {t('common.signUp')}
            <ArrowRightIcon className="h-5 w-5 text-gray-50" />
          </button>
        </div>
      </div>

      {state.error && <p className="text-red-600 mt-2">{state.error}</p>}
    </form>
  );
}
