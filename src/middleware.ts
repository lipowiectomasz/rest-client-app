import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth } from '@/auth';

const i18n = createMiddleware(routing);

export default auth((req) => {
  return i18n(req);
});

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
