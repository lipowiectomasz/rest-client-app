import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function Home() {
  const t = await getTranslations();

  const authenticated = await auth();

  if (authenticated) {
    return (
      <>
        <div className="max-w-screen-lg mx-auto">
          <section className="w-full px-4 py-16 min-h-100 sm:mt-[15vmax] md:mt-[10vmax] dark:bg-slate-800 bg-slate-50 rounded-t-lg inset-shadow-sm inset-shadow-slate-300 dark:inset-shadow-gray-600">
            <h1 className="text-center text-3xl">{t('mainPage.title')}</h1>
          </section>
          <section className="flex gap-6 items-center justify-evenly dark:bg-slate-800 bg-slate-100 rounded-b-lg shadow-md shadow-slate-600">
            <Link
              href="/rest"
              className="hover:bg-slate-50 hover:rounded-bl-lg w-full py-6 dark:hover:bg-slate-900"
            >
              <i>REST</i> Client
            </Link>
            <Link
              href="/history"
              className="hover:bg-slate-50 hover:rounded-br-lg w-full py-6 dark:hover:bg-slate-900"
            >
              {t('mainPage.history')}
            </Link>
            <Link
              href="/variables"
              className="hover:bg-slate-50 hover:rounded-br-lg w-full py-6 dark:hover:bg-slate-900"
            >
              {t('mainPage.variables')}
            </Link>
          </section>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="max-w-screen-lg mx-auto">
        <section className="flex flex-col gap-3 items-center justify-center w-full px-4 py-16 min-h-100 sm:mt-[15vmax] md:mt-[10vmax] dark:bg-slate-800 bg-slate-50 rounded-t-lg inset-shadow-sm inset-shadow-slate-300 dark:inset-shadow-gray-600">
          <h1 className=" text-3xl">{t('mainPage.title')}</h1>
          <h2 className="">{t('mainPage.subtitle')}</h2>
        </section>
        <section className="flex gap-6 items-center justify-evenly dark:bg-slate-800 bg-slate-100 rounded-b-lg shadow-md shadow-slate-600">
          <Link
            href="/signup"
            className="hover:bg-slate-50 hover:rounded-bl-lg w-full py-6 dark:hover:bg-slate-900"
          >
            {t('common.signUp')}
          </Link>
          <Link
            href="/signin"
            className="hover:bg-slate-50 hover:rounded-br-lg w-full py-6 dark:hover:bg-slate-900"
          >
            {t('common.signIn')}
          </Link>
        </section>
      </div>
    </>
  );
}
