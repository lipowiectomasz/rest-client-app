import type { NextAuthConfig } from 'next-auth';

const PROTECTED_ROUTES = new Set(['rest', 'rest-client', 'history', 'variables']);

export const authConfig = {
  pages: {
    signIn: '/signin',
    error: '/error',
  },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const pathSegments = nextUrl.pathname.split('/');
      const route = pathSegments[2] || '';

      const isProtected = PROTECTED_ROUTES.has(route);
      const isLoggedIn = !!auth?.user;

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL(`/${pathSegments[1] || 'en'}/signin`, nextUrl.origin);
        redirectUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        return Response.redirect(redirectUrl);
      }

      return true;
    },
    session({ session }) {
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
