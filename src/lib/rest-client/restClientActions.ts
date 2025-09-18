'use client';

import path from 'path';
import { b64EncodeUnicode } from '@/app/lib/utils/base64';
import { ProxyResponse } from '@/types/proxy';
import { Header } from '@/types/restClient';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function createRestClientActions({
  method,
  url,
  headers,
  body,
  setHeaders,
  setBody,
  setResponse,
  onChangeHeaders,
  onChangeBody,
  router,
  pathname,
}: {
  method: string;
  url: string;
  headers: Header[];
  body: string;
  setHeaders: (h: Header[]) => void;
  setBody: (b: string) => void;
  setResponse: (r: ProxyResponse | null) => void;
  onChangeHeaders: (h: Header[]) => void;
  onChangeBody: (b: string) => void;
  router: AppRouterInstance;
  pathname: string;
}) {
  async function sendRequest() {
    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          url,
          headers: Object.fromEntries(headers.map((h) => [h.key, h.value])),
          body,
        }),
      });

      const data: ProxyResponse = await res.json();
      setResponse(data);

      const params = new URLSearchParams();
      params.set('url', b64EncodeUnicode(url));
      if (headers.length > 0) {
        params.set('headers', encodeURIComponent(JSON.stringify(headers)));
      }
      if (body && body.trim() !== '') {
        params.set('body', encodeURIComponent(body));
      }

      router.replace(path.join(pathname, `?${params.toString()}`));
    } catch (err) {
      setResponse({ error: err instanceof Error ? err.message : String(err) });
    }
  }

  function addHeader() {
    const newHeaders = [...headers, { key: '', value: '' }];
    setHeaders(newHeaders);
    onChangeHeaders(newHeaders);
  }

  function prettify() {
    try {
      const pretty = JSON.stringify(JSON.parse(body), null, 2);
      setBody(pretty);
      onChangeBody(pretty);
    } catch {
      alert('Invalid JSON');
    }
  }

  return { sendRequest, addHeader, prettify };
}
