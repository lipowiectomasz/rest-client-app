'use client';

import { useTranslations } from 'next-intl';
import Box from '../ui/Box';

type ResponseData =
  | { status?: number; body?: string | object; error?: string }
  | { key: string; value: string }[]
  | { error: string }
  | null;

export function ResponseViewer({ response }: { response: ResponseData }) {
  const t = useTranslations('restClientPage');
  if (!response)
    return (
      <Box className="py-3 !px-0 md:!mt-1 justify-start min-h-auto !rounded-md">
        <p className="text-md text-indigo-900">{t('text.noResponse')}</p>
      </Box>
    );

  // Si es un array de headers/pares clave-valor
  if (Array.isArray(response)) {
    return (
      <Box className="py-3 !px-0 md:!mt-1 justify-start min-h-auto !rounded-md">
        <p className="font-bold">{t('text.response')}:</p>
        <ul className="mt-2">
          {response.map((item, idx) => (
            <li key={idx}>
              <span className="font-mono">{item.key}:</span>{' '}
              <span className="font-mono">{item.value}</span>
            </li>
          ))}
        </ul>
      </Box>
    );
  }

  // Si es un objeto con error
  if ('error' in response && response.error) {
    return (
      <Box className="py-3 !px-0 md:!mt-1 justify-start min-h-auto !rounded-md">
        <p className="text-md text-red-500">
          {t('text.error')}: {response.error}
        </p>
      </Box>
    );
  }

  // Si es un objeto con status/body
  return (
    <Box className="py-0 px-2 md:!mt-0 overflow-auto !items-start h-150 !justify-start">
      {'status' in response && response.status !== undefined && (
        <p className="text-md mt-3 text-indigo-800">
          <b>Status:</b> {response.status}
        </p>
      )}
      {'body' in response && response.body !== undefined && (
        <pre className="dark:bg-black bg-slate-50 text-indigo-900 p-2 rounded max-w-screen-md ">
          {typeof response.body === 'string'
            ? response.body
            : JSON.stringify(response.body, null, 2)}
        </pre>
      )}
    </Box>
  );
}
