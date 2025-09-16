import { redirect } from 'next/navigation';

export default async function RestClientRedirect(props: {
  params: Promise<{ locale: string } | Promise<{ locale: string }>>;
}) {
  const params = await props.params;
  const resolvedParams = await Promise.resolve(params);
  redirect(`/${resolvedParams.locale}/rest-client/GET`);
  return null;
}
