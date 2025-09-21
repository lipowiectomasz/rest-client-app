import { HttpRequestSnapshot } from '../types';
import type { Variable } from '@/lib/variables/variablesStorage';
import { applyVariablesToRequest } from './applyVariables';

export function generateJsXhr(req: HttpRequestSnapshot, vars: Variable[] = []): string {
  const r = applyVariablesToRequest(req, vars);

  const headers = r.headers
    .map((h) => `xhr.setRequestHeader("${h.key}", "${h.value}");`)
    .join('\n');

  return `const xhr = new XMLHttpRequest();
xhr.open("${r.method}", "${r.url}");
${headers}
xhr.onload = () => {
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log(xhr.responseText);
  } else {
    console.error("Request failed:", xhr.statusText);
  }
};
xhr.onerror = () => console.error("Network error");
${r.body ? `xhr.send(${JSON.stringify(r.body)});` : 'xhr.send();'}`;
}
