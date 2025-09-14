import type { NextAuthConfig } from 'next-auth';

const PROTECTED = new Set(['rest', 'history', 'variables']);

export const authConfig = {
  pages: {
    signIn: '/signin',
    error: '/error',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname.slice(3);

      const needsAuth = PROTECTED.has(path);

      console.log(needsAuth, path);

      if (!needsAuth) return true;
      return !!auth?.user;
    },
    session({ session }) {
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
