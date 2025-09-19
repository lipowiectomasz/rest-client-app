import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import DeleteButton from '@/components/ui/DeleteButton';

function encodeForUrl(str: string): string {
  return Buffer.from(str).toString('base64');
}

export default async function HistoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/signin');
  }

  const t = await getTranslations('historyPage');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      requests: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 100,
      },
    },
  });

  if (!user) {
    redirect('/signin');
  }

  const { requests } = user;

  const handleDelete = async (id: string) => {
    'use server';
    redirect(`/${locale}/history?refresh=${Date.now()}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('title')}</h1>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">{t('emptyState.message')}</p>
          <Link
            href={`/${locale}/rest-client`}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {t('emptyState.cta')}
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.method')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.url')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.duration')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.timestamp')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => {
                // Encode the URL and body for the REST client URL
                const encodedUrl = encodeForUrl(request.url);
                const encodedBody = request.body ? encodeForUrl(request.body) : null;

                // Parse headers and create query parameters
                let headersQuery = '';
                try {
                  const headersObj = JSON.parse(request.headers);
                  const queryParams = new URLSearchParams();

                  Object.entries(headersObj).forEach(([key, value]) => {
                    if (value && typeof value === 'string') {
                      queryParams.append(key, value);
                    }
                  });

                  headersQuery = queryParams.toString();
                } catch (error) {
                  console.error('Failed to parse headers:', error);
                }

                // Build the REST client URL
                let restClientUrl = `/${locale}/rest-client/${request.method}/${encodedUrl}`;
                if (encodedBody) {
                  restClientUrl += `/${encodedBody}`;
                }
                if (headersQuery) {
                  restClientUrl += `?${headersQuery}`;
                }

                return (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.method === 'GET'
                            ? 'bg-green-100 text-green-800'
                            : request.method === 'POST'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.method === 'PUT'
                                ? 'bg-blue-100 text-blue-800'
                                : request.method === 'DELETE'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {request.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      <Link
                        href={restClientUrl}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                        title={request.url}
                      >
                        {request.url}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.statusCode &&
                          request.statusCode >= 200 &&
                          request.statusCode < 300
                            ? 'bg-green-100 text-green-800'
                            : request.statusCode && request.statusCode >= 400
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {request.statusCode || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {request.duration}ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {request.createdAt.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={restClientUrl}
                          className="text-indigo-600 hover:text-indigo-900 px-3 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 transition-colors"
                        >
                          {t('table.view')}
                        </Link>
                        <DeleteButton historyId={request.id} onDelete={handleDelete} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
