'use client';
import { useState, useEffect } from 'react';
import { RestClientButtons } from '@/components/rest-client';

interface Header {
  key: string;
  value: string;
}

export function HeadersEditor({
  value,
  onChange,
}: {
  value: Header[];
  onChange: (h: Header[]) => void;
}) {
  const [headers, setHeaders] = useState<Header[]>(value ?? []);

  useEffect(() => {
    setHeaders(value ?? []);
  }, [value]);

  function addHeader() {
    const newHeaders = [...headers, { key: '', value: '' }];
    setHeaders(newHeaders);
    onChange(newHeaders);
  }

  function updateHeader(index: number, field: keyof Header, value: string) {
    const newHeaders = headers.map((h, i) => (i === index ? { ...h, [field]: value } : h));
    setHeaders(newHeaders);
    onChange(newHeaders);
  }

  function removeHeader(index: number) {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
    onChange(newHeaders);
  }

  return (
    <div className="space-y-2">
      <RestClientButtons onAddHeader={addHeader} />
      {headers.map((header, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            placeholder="Header Key"
            value={header.key}
            onChange={(e) => updateHeader(idx, 'key', e.target.value)}
            className="w-full px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 rounded-md inset-shadow-sm inset-shadow-slate-300 dark:inset-shadow-gray-600"
          />
          <input
            placeholder="Header Value"
            value={header.value}
            onChange={(e) => updateHeader(idx, 'value', e.target.value)}
            className="w-full px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 rounded-md inset-shadow-sm inset-shadow-slate-300 dark:inset-shadow-gray-600"
          />
          <button onClick={() => removeHeader(idx)} className="px-2 text-red-500">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
