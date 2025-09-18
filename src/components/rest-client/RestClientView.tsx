'use client';

import { useState } from 'react';
import {
  MethodSelector,
  UrlInput,
  HeadersEditor,
  BodyEditor,
  ResponseViewer,
} from '@/components/rest-client';
import { RestClientInitial, Header } from '@/types/restClient';
import { ProxyResponse } from '@/types/proxy';
import { usePathname, useRouter } from '@/i18n/navigation';
import { createRestClientActions } from '@/lib/rest-client/restClientActions';
import { ButtonsBar } from '../ui/ButtonsBar';
import { useTranslations } from 'next-intl';
import { CodegenPanel } from '@/components/rest-client/CodegenPanel';

export default function RestClientView({ initial }: { initial: RestClientInitial }) {
  const [method, setMethod] = useState<RestClientInitial['method']>(initial.method);
  const [url, setUrl] = useState(initial.url ?? '');
  const [headers, setHeaders] = useState<Header[]>(initial.headers ?? []);
  const [body, setBody] = useState(initial.body ?? '');
  const [response, setResponse] = useState<ProxyResponse | null>(null);

  const t = useTranslations('restClientPage');

  const router = useRouter();
  const pathname = usePathname();

  const { sendRequest, addHeader, prettify } = createRestClientActions({
    method,
    url,
    headers,
    body,
    setHeaders,
    setBody,
    setResponse,
    onChangeHeaders: setHeaders,
    onChangeBody: setBody,
    router,
    pathname,
  });

  return (
    <div className="max-w-screen-lg mx-auto">
      <h1 className="text-3xl pt-8">Rest Client</h1>

      <div className="flex gap-4">
        <MethodSelector initialMethod={method} onChange={(m) => setMethod(m as typeof method)} />
        <UrlInput value={url} onChange={setUrl} />
      </div>

      <HeadersEditor value={headers} onChange={setHeaders} />

      <ButtonsBar
        buttons={[
          { label: t('buttons.sendRequest'), onClick: sendRequest, variant: 'group' },
          { label: 'Prettify', onClick: prettify, variant: 'group' },
          { label: t('buttons.addHeader'), onClick: addHeader, variant: 'group' },
        ]}
      />

      <BodyEditor value={body} onChange={setBody} />

      <ResponseViewer response={response} />
      <CodegenPanel
        request={{
          method,
          url,
          headers,
          body,
        }}
      />
    </div>
  );
}
