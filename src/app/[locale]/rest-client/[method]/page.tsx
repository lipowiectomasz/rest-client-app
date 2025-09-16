// src/app/[locale]/rest-client/[method]/page.tsx
import RestClientView from '@/components/rest-client/RestClientView';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Header, HttpMethod } from '@/types/restClient';

export default async function RestClientPage(props: {
  params: Promise<{ locale: string; method: string } | Promise<{ locale: string; method: string }>>;
  searchParams: Promise<
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>
  >;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const { locale, method } = resolvedParams;

  const session = await auth();
  if (!session) {
    redirect(`/${locale}`);
    return null;
  }
  const url = typeof resolvedSearchParams.url === 'string' ? resolvedSearchParams.url : '';
  const body = typeof resolvedSearchParams.body === 'string' ? resolvedSearchParams.body : '';
  const headers: Header[] = [];

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (key !== 'url' && key !== 'body') {
      headers.push({ key, value: Array.isArray(value) ? value[0] : (value ?? '') });
    }
  }
  return (
    <RestClientView
      initial={{
        locale,
        method: method as HttpMethod,
        url,
        body,
        headers,
      }}
    />
  );
}
