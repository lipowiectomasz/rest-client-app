import { Variable } from '@/lib/variables/variablesStorage';

export function replaceVariables(str: string, variables: Variable[]): string {
  if (!str) return str;
  return str.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const found = variables.find((v) => v.key === key.trim());
    return found ? found.value : '';
  });
}

export function replaceVariablesInHeaders(
  headers: { key: string; value: string }[],
  variables: Variable[],
) {
  return headers.map((h) => ({
    key: replaceVariables(h.key, variables),
    value: replaceVariables(h.value, variables),
  }));
}
