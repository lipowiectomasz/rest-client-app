import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { signInSchema } from './lib/zod';

export const { signIn, signOut, auth, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        let user = null;

        const testUser = {
          email: 'test@test.com',
          password: 'testtest',
        };

        const { email, password } = await signInSchema.parseAsync(credentials);

        if (password === testUser.password && email === testUser.email) {
          user = testUser;
        }

        if (!user) {
          return null;
        }

        return user;
      },
    }),
  ],
});
