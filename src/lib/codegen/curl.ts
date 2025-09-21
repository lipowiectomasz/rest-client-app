import type { HttpRequestSnapshot } from '../types';
import type { Variable } from '@/lib/variables/variablesStorage';
import { applyVariablesToRequest } from './applyVariables';

function escapeShell(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

export function generateCurl(req: HttpRequestSnapshot, vars: Variable[] = []): string {
  const r = applyVariablesToRequest(req, vars);
  const parts: string[] = [];

  parts.push(`curl -X ${r.method.toUpperCase()}`);

  (r.headers ?? [])
    .filter((h) => h.key.trim() !== '')
    .forEach((h) => {
      parts.push(`-H "${escapeShell(h.key)}: ${escapeShell(h.value)}"`);
    });

  const hasBody = r.body && r.body.trim() !== '' && !/^(GET|HEAD)$/i.test(r.method);
  if (hasBody) {
    parts.push(`-d '${r.body}'`);
  }

  parts.push(`${escapeShell(r.url)}`);
  return parts.join(' \\\n  ');
}
