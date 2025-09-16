import { b64EncodeUnicode } from './base64';

export function applyVariablesToString(input: string, vars: Record<string, string>): string {
  return input.replace(/{{\s*([^}]+)\s*}}/g, (_, name) => {
    return String(vars[name] ?? '');
  });
}

export function applyVariables<T>(obj: T, vars: Record<string, string>): T {
  if (typeof obj === 'string') {
    return applyVariablesToString(obj, vars) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((v) => applyVariables(v, vars)) as T;
  }

  if (obj && typeof obj === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(obj)) {
      out[k] = applyVariables((obj as Record<string, unknown>)[k], vars);
    }
    return out as T;
  }

  return obj;
}

export function buildRestClientRoute({
  locale,
  method,
  url,
  body,
  headers,
}: {
  locale: string;
  method: string;
  url: string;
  body?: string | object;
  headers?: Record<string, string>;
}) {
  const urlB64 = b64EncodeUnicode(url);
  let path = `/${locale}/rest-client/${method}/${urlB64}`;

  if (body !== undefined && body !== null && body !== '') {
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    const bodyB64 = b64EncodeUnicode(bodyStr);
    path += `/${bodyB64}`;
  }

  const params = new URLSearchParams();
  if (headers) {
    Object.entries(headers).forEach(([k, v]) => {
      params.set(k, v);
    });
  }

  return params.toString() ? `${path}?${params.toString()}` : path;
}
