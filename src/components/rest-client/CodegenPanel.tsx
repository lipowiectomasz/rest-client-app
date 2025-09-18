'use client';

import { useMemo, useState } from 'react';
import type { HttpRequestSnapshot } from '@/lib/types';
import { generateCurl } from '@/lib/codegen/curl';

const GENERATORS = {
  curl: generateCurl,
  // later: jsFetch, xhr, node, python, java, csharp, go
};

export function CodegenPanel({ request }: { request: HttpRequestSnapshot }) {
  const [lang, setLang] = useState<keyof typeof GENERATORS>('curl');

  const code = useMemo(() => {
    try {
      return GENERATORS[lang](request);
    } catch {
      return '// Not enough details to generate code';
    }
  }, [request, lang]);

  return (
    <div className="mt-6 border rounded bg-gray-50 p-4">
      <div className="flex gap-2 mb-3">
        {Object.keys(GENERATORS).map((key) => (
          <button
            key={key}
            onClick={() => setLang(key as keyof typeof GENERATORS)}
            className={`px-3 py-1 rounded ${
              lang === key ? 'bg-indigo-500 text-white' : 'bg-gray-200'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      <pre className="bg-black text-green-300 p-3 rounded overflow-x-auto text-sm">{code}</pre>
      <button
        onClick={() => navigator.clipboard.writeText(code)}
        className="mt-2 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Copy
      </button>
    </div>
  );
}
