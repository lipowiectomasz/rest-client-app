import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function HistoryPage() {
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">{t('emptyState.message')}</p>
          <Link href="/rest-client" className="text-indigo-600 hover:text-indigo-800 font-medium">
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
              {requests.map((request) => (
                <tr key={request.id}>
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
                    {request.url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.statusCode && request.statusCode >= 200 && request.statusCode < 300
                          ? 'bg-green-100 text-green-800'
                          : request.statusCode && request.statusCode >= 400
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {request.statusCode || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{request.duration}ms</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.createdAt.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/rest-client?historyId=${request.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {t('table.view')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
