'use client';
import {
  MethodSelector,
  UrlInput,
  HeadersEditor,
  BodyEditor,
  ResponseViewer,
  CodegenPanel,
} from '@/components/rest-client';
import { ButtonsBar } from '@/components/ui/ButtonsBar';
import { useTranslations } from 'next-intl';
import { useRestClientRequest, BodyContentType } from '@/lib/rest-client/useRestClientRequest';

export default function RestClientView() {
  const t = useTranslations('restClientPage');
  const {
    method,
    setMethod,
    url,
    setUrl,
    headers,
    setHeaders,
    body,
    setBody,
    response,
    sendRequest,
    addHeader,
    prettify,
    loading,
    error,
    bodyContentType,
    setBodyContentType,
  } = useRestClientRequest();

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
      >
        <select
          name="content-type"
          value={bodyContentType}
          onChange={(e) => setBodyContentType(e.target.value as BodyContentType)}
          className={`dark:bg-slate-800 bg-slate-100 px-4 py-[8.5px] text-indigo-600 text-md font-medium border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[180px]${method === 'GET' ? ' hidden' : ''}`}
        >
          <option value="application/json">Json</option>
          <option value="text/plain">Text</option>
        </select>
      </ButtonsBar>

      {method !== 'GET' && <BodyEditor value={body} onChange={setBody} />}

      {loading && <p className="text-gray-600 mt-2">Loading...</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}

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
