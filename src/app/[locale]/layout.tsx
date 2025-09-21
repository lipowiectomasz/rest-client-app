import type { Metadata } from 'next';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Navbar from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'REST Client App – Lightweight API Testing Tool with Authentication, History & Variables',
  description:
    'A modern, lightweight alternative to Postman for testing RESTful APIs. Built with React and Next.js/React Router 7, the app includes authentication, request history, variables, code generation (cURL, JavaScript, Python, etc.), and detailed response handling. Designed for teams, with a clean UI, private routes, and support for internationalization',
};
type Params = Promise<{ locale: string }>;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  const session = await auth();

  return (
    <html lang={locale}>
      <body className="">
        <SessionProvider session={session} refetchOnWindowFocus={true}>
          <NextIntlClientProvider messages={messages}>
            <Navbar session={session} />
            <main className="min-h-[60dvh] mt-18">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
