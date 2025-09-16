'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/16/solid';
import { useActionState, useRef } from 'react';
import { signUp } from '@/actions/auth';

export default function SignUpForm() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  const [state, formAction] = useActionState(signUp, {
    error: null,
  });

  // Referencias para los campos de contraseña
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  // Validación en el cliente antes de enviar
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
    <form action={formAction} onSubmit={handleSubmit}>
      <input type="hidden" name="locale" value={locale} />
      <div className="flex-1 rounded-lg bg-gray-5000 px-6 pb-4 pt-6">
        <h1 className="mb-3 text-2x1">{t('signUp.header')}</h1>
        <div className="w-full">
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="name">
              {t('common.name')}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                type="text"
                name="name"
                placeholder={t('common.placeholder.name')}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email">
              {t('common.email')}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder={t('common.placeholder.email')}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password">
              {t('common.password')}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder={t('common.placeholder.password')}
                required
                minLength={8}
                ref={passwordRef}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\[\]{};':&quot;\\|,.<>/?-]).{8,}$"
                title="Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
                autoComplete="new-password"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="confirmPassword"
            >
              {t('common.confirmPassword') || 'Confirm Password'}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder={t('common.placeholder.confirmPassword') || 'Confirm your password'}
                required
                minLength={8}
                ref={confirmPasswordRef}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\[\]{};':&quot;\\|,.<>/?-]).{8,}$"
                title="Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
                autoComplete="new-password"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>
      <button className="mt-4 w-150 bg-gray-600 cursor-pointer">
        {t('common.signUp')}
        <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
      </button>
      <div>{state.error && <p>{state.error}</p>}</div>
    </form>
  );
}
