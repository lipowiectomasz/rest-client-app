'use client';

import { useMemo, useState } from 'react';
import type { HttpRequestSnapshot } from '@/lib/types';
import { generateCurl } from '@/lib/codegen/curl';
import { generateJsFetch } from '@/lib/codegen/js-fetch';
import { generateJsXhr } from '@/lib/codegen/js-xhr';
import { generateNode } from '@/lib/codegen/node';
import { generatePython } from '@/lib/codegen/python';
import { generateJava } from '@/lib/codegen/java';
import { generateCSharp } from '@/lib/codegen/csharp';
import { generateGo } from '@/lib/codegen/go';

const GENERATORS = {
  curl: generateCurl,
  jsFetch: generateJsFetch,
  xhr: generateJsXhr,
  node: generateNode,
  python: generatePython,
  java: generateJava,
  csharp: generateCSharp,
  go: generateGo,
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
              lang === key ? 'bg-indigo-500 text-white' : 'bg-indigo-300'
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
