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
import { RestClientInitial, Header } from '@/types/restClient';
import { ProxyResponse } from '@/types/proxy';
import { b64DecodeUnicode } from '@/app/lib/utils/base64';

export default function RestClientView({ initial }: { initial: RestClientInitial }) {
  const [method, setMethod] = useState<RestClientInitial['method']>(initial.method);
  const [url, setUrl] = useState(initial.url ?? '');
  const [headers, setHeaders] = useState<Header[]>(initial.headers ?? []);
  const [body, setBody] = useState(initial.body ?? '');
  const [response, setResponse] = useState<ProxyResponse | null>(null);

  async function sendRequest() {
    try {
      const decodedUrl = b64DecodeUnicode(url);
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          url: decodedUrl,
          headers: Object.fromEntries(headers.map((h) => [h.key, h.value])),
          body,
        }),
      });

      const data: ProxyResponse = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: err instanceof Error ? err.message : String(err) });
    }
  }

  return (
    <div className="max-w-screen-lg mx-auto">
      <h1 className="text-3xl pt-8">Rest Client</h1>

      <div className="flex gap-4">
        <MethodSelector initialMethod={method} onChange={(m) => setMethod(m as typeof method)} />
        <UrlInput value={url} onChange={setUrl} />
      </div>

      <HeadersEditor value={headers} onChange={setHeaders} />
      <BodyEditor value={body} onChange={setBody} />

      <RestClientButtons onSendRequest={sendRequest} />

      <ResponseViewer response={response} />
    </div>
  );
}
