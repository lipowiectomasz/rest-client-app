import { HttpRequestSnapshot } from '../types';

function escapeShell(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

export function generateCurl(req: HttpRequestSnapshot): string {
  const parts: string[] = [];

  parts.push(`curl -X ${req.method.toUpperCase()}`);

  req.headers
    .filter((h) => h.key.trim() !== '')
    .forEach((h) => {
      parts.push(`-H "${escapeShell(h.key)}: ${escapeShell(h.value)}"`);
    });

  const hasBody = req.body && req.body.trim() !== '' && !/^(GET|HEAD)$/i.test(req.method);

  if (hasBody) {
    parts.push(`-d '${req.body}'`);
  }

  parts.push(`${escapeShell(req.url)}`);

  return parts.join(' \\\n  ');
}
