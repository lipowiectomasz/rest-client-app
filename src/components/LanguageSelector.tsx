'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

const LanguageSelector = () => {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('navigation');
  const currentLocale = pathname?.split('/')[1] || 'en';
  const [selectedLocale, setSelectedLocale] = useState('');

  const getLanguageName = (locale: string) => {
    const languageNames: Record<string, string> = {
      be: 'Беларуская',
      de: 'Deutsch',
      en: 'English',
      es: 'Español',
      ru: 'Русский',
    };
    return languageNames[locale] || locale.toUpperCase();
  };

  const handleLanguageChange = (newLocale: string) => {
    setSelectedLocale(newLocale);
    if (!pathname) return;

    const segments = pathname.split('/');
    if (segments.length > 1 && locales.includes(segments[1] as 'en' | 'es' | 'ru' | 'de' | 'be')) {
      segments[1] = newLocale;
      router.push(segments.join('/'));
    } else {
      router.push(`/${newLocale}${pathname}`);
    }
  };

  return (
    <select
      name="languages"
      value={selectedLocale}
      onChange={(e) => handleLanguageChange(e.target.value)}
      className="px-3 py-2 border border-indigo-200 rounded-md bg-white text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="" disabled>
        {t('language')}
      </option>
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {getLanguageName(locale)}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
