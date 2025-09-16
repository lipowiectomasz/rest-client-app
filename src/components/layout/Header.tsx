'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { createNavigation } from 'next-intl/navigation';
import { locales } from '@/i18n/routing';
import Image from 'next/image';
import LanguageSelector from '../LanguageSelector';
import { signOut, useSession } from 'next-auth/react';
// import ThemeSelector from './ThemeSelector';

const navigation = createNavigation({ locales });

const Navbar = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const { data: session } = useSession();

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === `/${locale}${path}`;

  return (
    <nav className="flex justify-center">
      <div
        className={`fixed top-0 z-50 transition-all duration-400 ease-in-out w-full
        ${
          isSticky
            ? 'max-w-screen-lg mx-auto mt-2 rounded-2xl shadow-lg gap-x-10 bg-indigo-200/60 backdrop-blur-lg justify-around'
            : 'bg-indigo-200 justify-evenly'
        }
        text-indigo-900 py-4 px-6 flex items-center mb-8`}
      >
        {/* Left side - links */}
        <div className="flex items-center gap-3">
          <navigation.Link href="/">
            <Image
              src="/images/logos/rss-logo.svg"
              alt="RSS logo"
              width={30}
              height={30}
              priority
            />
          </navigation.Link>

          <navigation.Link
            href="/"
            className={`text-lg font-bold transition-colors ${
              isActive('')
                ? 'underline underline-offset-4 text-purple-900'
                : 'hover:text-purple-500'
            }`}
          >
            {t('navigation.home')}
          </navigation.Link>
        </div>
        {/* Right side - controls */}
        <div className="flex items-center gap-4">
          <LanguageSelector />
          {/* Auth buttons */}
          {session ? (
            <button
              className="px-4 py-2 text-md font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              onClick={() => signOut()}
            >
              {t('common.logOut')}
            </button>
          ) : (
            <>
              <navigation.Link
                href="/signin"
                className="px-4 py-2 text-md font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                {t('common.signIn')}
              </navigation.Link>
              <navigation.Link
                href="/signup"
                className="px-4 py-2 text-md font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                {t('common.signUp')}
              </navigation.Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
