import { redirect } from 'next/navigation';

export default async function RestClientRedirect({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  redirect(`/${resolvedParams.locale}/rest-client/GET`);
  return null;
}
