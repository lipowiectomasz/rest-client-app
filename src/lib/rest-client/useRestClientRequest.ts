import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { b64EncodeUnicode, b64DecodeUnicode } from '@/app/lib/utils/base64';
import { ProxyResponse } from '@/types/proxy';
import { Header, HttpMethod } from '@/types/restClient';
import { prettifyJson } from './prettifyJson';
import { addEmptyHeader } from './addEmptyHeader';

export type BodyContentType = 'application/json' | 'text/plain';

export function useRestClientRequest() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [method, setMethod] = useState<HttpMethod>('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState<Header[]>([]);
  const [bodyContentType, setBodyContentType] = useState<BodyContentType>('application/json');
  const [response, setResponse] = useState<ProxyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const path = pathname.split('/').filter(Boolean);
    const restIdx = path.indexOf('rest-client');
    if (restIdx !== -1 && path.length > restIdx + 1) {
      const method = path[restIdx + 1] as HttpMethod;
      const encodedUrl = path[restIdx + 2];
      const encodedBody = path[restIdx + 3];
      try {
        setMethod(method);
        setUrl(encodedUrl ? b64DecodeUnicode(encodedUrl) : '');
        setBody(encodedBody ? b64DecodeUnicode(encodedBody) : '');
        const headersArr: Header[] = [];
        searchParams.forEach((value, key) => {
          headersArr.push({ key, value: Array.isArray(value) ? value[0] : (value ?? '') });
        });
        setHeaders(headersArr);

        if (encodedUrl) {
          runRequest(
            method,
            b64DecodeUnicode(encodedUrl),
            encodedBody ? b64DecodeUnicode(encodedBody) : '',
            headersArr,
          );
        }
      } catch {
        setError('Error decoding URL');
      }
    }
  }, [pathname, searchParams]);

  async function runRequest(method: HttpMethod, url: string, body: string, headers: Header[]) {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const payload: {
        method: HttpMethod;
        url: string;
        headers: Record<string, string>;
        body?: string;
      } = {
        method,
        url,
        headers: Object.fromEntries(headers.map((h) => [h.key, h.value])),
      };
      if (
        body &&
        body.trim() !== '' &&
        (method as string) !== 'GET' &&
        (method as string) !== 'HEAD'
      ) {
        payload.body = body;
      }
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': bodyContentType },
        body: JSON.stringify(payload),
      });
      const data: ProxyResponse = await res.json();
      setResponse(data);
    } catch {
      setError('Error sending request');
    } finally {
      setLoading(false);
    }
  }

  function sendRequest() {
    const encodedUrl = b64EncodeUnicode(url);
    let encodedBody: string | null = null;
    if (
      body &&
      body.trim() !== '' &&
      (method as string) !== 'GET' &&
      (method as string) !== 'HEAD'
    ) {
      encodedBody = b64EncodeUnicode(body);
    }
    const query = new URLSearchParams();
    headers.forEach((h) => {
      if (h.key && h.value) {
        query.set(h.key, encodeURIComponent(h.value));
      }
    });
    let route = `/rest-client/${method}/${encodedUrl}`;
    if (encodedBody) {
      route += `/${encodedBody}`;
    }
    if (query.toString()) {
      route += `?${query.toString()}`;
    }
    router.replace(route, { scroll: false });
    runRequest(method, url, body, headers);
  }

  function addHeader() {
    setHeaders(addEmptyHeader(headers));
  }

  function prettify() {
    const pretty = prettifyJson(body);
    if (pretty !== null) {
      setBody(pretty);
    } else {
      alert('Invalid JSON');
    }
  }

  return {
    method,
    setMethod,
    url,
    setUrl,
    body,
    setBody,
    headers,
    setHeaders,
    bodyContentType,
    setBodyContentType,
    response,
    loading,
    error,
    sendRequest,
    addHeader,
    prettify,
  };
}
