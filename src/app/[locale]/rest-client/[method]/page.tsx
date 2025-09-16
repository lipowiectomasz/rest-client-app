// src/app/[locale]/rest-client/[method]/page.tsx
import RestClientView from '@/components/rest-client/RestClientView';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function RestClientPage({
  params,
}: {
  params: { locale: string; method: string } | Promise<{ locale: string; method: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const { locale, method } = resolvedParams;

  const session = await auth();
  if (!session) {
    redirect(`/${locale}`);
    return null;
  }

  return <RestClientView locale={locale} method={method} />;
}
