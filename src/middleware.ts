import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth } from '@/auth';

const i18n = createMiddleware(routing);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/api/') ||
    pathname.includes('signin') ||
    pathname.includes('signup') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')
  ) {
    return i18n(req);
  }

  return i18n(req);
});

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
