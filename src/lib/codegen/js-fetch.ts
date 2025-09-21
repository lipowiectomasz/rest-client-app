import { HttpRequestSnapshot } from '../types';
import type { Variable } from '@/lib/variables/variablesStorage';
import { applyVariablesToRequest } from './applyVariables';

export function generateJsFetch(req: HttpRequestSnapshot, vars: Variable[] = []): string {
  const r = applyVariablesToRequest(req, vars);

  const headers = r.headers.reduce(
    (acc, h) => {
      if (h.key && h.value) acc[h.key] = h.value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return `fetch("${r.url}", {
  method: "${r.method}",
  headers: ${JSON.stringify(headers, null, 2)},
  body: ${r.body ? JSON.stringify(r.body) : 'undefined'}
}).then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;
}
