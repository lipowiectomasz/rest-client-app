'use client';

import { useState } from 'react';
import {
  MethodSelector,
  UrlInput,
  HeadersEditor,
  BodyEditor,
  ResponseViewer,
  RestClientButtons,
} from '@/components/rest-client';

export default function RestClientView({ method }: { locale: string; method: string }) {
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<
    { key: string; value: string }[] | { error: string } | null
  >(null);
  async function sendRequest() {
    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        body: JSON.stringify({
          method,
          url,
          headers: Object.fromEntries(headers.map((h) => [h.key, h.value])),
          body,
        }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      let errorMsg = 'Unknown error';
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      setResponse({ error: errorMsg });
    }
  }
  return (
    <>
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-3xl pt-8">Rest Client</h1>
        <div className="flex gap-4">
          <MethodSelector initialMethod={method} />
          <UrlInput onChange={setUrl} />
        </div>
        <HeadersEditor onChange={setHeaders} />
        <BodyEditor onChange={setBody} />
        <RestClientButtons onSendRequest={sendRequest} />
        <ResponseViewer response={response} />
      </div>
    </>
  );
}
