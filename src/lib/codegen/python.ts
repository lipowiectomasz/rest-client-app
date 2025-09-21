import { HttpRequestSnapshot } from '../types';
import type { Variable } from '@/lib/variables/variablesStorage';
import { applyVariablesToRequest } from './applyVariables';

export function generatePython(req: HttpRequestSnapshot, vars: Variable[] = []): string {
  const r = applyVariablesToRequest(req, vars);

  const headers = r.headers.reduce(
    (acc, h) => {
      if (h.key && h.value) acc[h.key] = h.value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return `import requests

url = "${r.url}"
payload = ${r.body ? JSON.stringify(r.body, null, 2) : 'None'}
headers = ${JSON.stringify(headers, null, 2)}

response = requests.request("${r.method}", url, headers=headers, data=payload)

print(response.text)`;
}
