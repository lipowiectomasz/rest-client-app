import type { HttpRequestSnapshot } from '@/lib/types';
import type { Variable } from '@/lib/variables/variablesStorage';
import { replaceVariables, replaceVariablesInHeaders } from '@/lib/variables/replaceVariables';

export function applyVariablesToRequest(
  req: HttpRequestSnapshot,
  vars: Variable[] = [],
): HttpRequestSnapshot {
  return {
    ...req,
    url: replaceVariables(req.url, vars),
    body: replaceVariables(req.body ?? '', vars),
    headers: replaceVariablesInHeaders(req.headers ?? [], vars),
  };
}
