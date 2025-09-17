import RestClientView from '@/components/rest-client/RestClientView';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Header, HttpMethod } from '@/types/restClient';
type Params = Promise<{ locale: string; method: string }>;
type SearchParams = Promise<
  | Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>
>;
export default async function RestClientPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { locale, method } = params;

  const session = await auth();
  if (!session) {
    redirect(`/${locale}/`);
  }

  const url = typeof searchParams.url === 'string' ? searchParams.url : '';
  const body = typeof searchParams.body === 'string' ? searchParams.body : '';
  const headers: Header[] = [];

  for (const [key, value] of Object.entries(searchParams)) {
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
