'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50 py-4 mt-10">
      <div className="max-w-screen-md mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Author GitHub */}
        <ul className="text-sm text-gray-600 list-inside">
          {t('builtBy')}
          <li>
            <Link
              href="https://github.com/lipowiectomasz"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 flex-row py-2 px-2 text-indigo-900 hover:scale-105  border-1 border-indigo-200 rounded-sm "
            >
              <Image
                className="inline-block rounded-full"
                src="/images/avatars/fasolll.jpeg"
                alt="RSS logo"
                width={30}
                height={30}
                loading="lazy"
              />
              Team Lead - Tomasz LIpowiec
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/deepcd87"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 flex-row py-2 px-2 text-indigo-900 hover:scale-105  border-1 border-indigo-200 rounded-sm "
            >
              <Image
                className="inline-block rounded-full"
                src="/images/avatars/default.jpg"
                alt="RSS logo"
                width={30}
                height={30}
                loading="lazy"
              />
              Deniss Patancevs
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/kattrr"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 flex-row py-2 px-2 text-indigo-900 hover:scale-105  border-1 border-indigo-200 rounded-sm "
            >
              <Image
                className="inline-block rounded-full"
                src="/images/avatars/kattrr.jpeg"
                alt="RSS logo"
                width={30}
                height={30}
                loading="lazy"
              />
              Kathering Rivera
            </Link>
          </li>
        </ul>

        {/* Year */}
        <p className="text-sm text-gray-600">
          © {year} {t('text')}
        </p>

        {/* RS School Logo */}
        <Link
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Image
            src="/images/logos/rss-logo.svg"
            alt="RS School ReactJS"
            width={90}
            height={90}
            className="object-contain"
          />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
