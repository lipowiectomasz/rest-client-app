import { HttpRequestSnapshot } from '../types';
import type { Variable } from '@/lib/variables/variablesStorage';
import { applyVariablesToRequest } from './applyVariables';

export function generateNode(req: HttpRequestSnapshot, vars: Variable[] = []): string {
  const r = applyVariablesToRequest(req, vars);
  const url = new URL(r.url);

  return `const https = require("https");

const options = {
  hostname: "${url.hostname}",
  port: ${url.port || 443},
  path: "${url.pathname}${url.search}",
  method: "${r.method}",
  headers: ${JSON.stringify(
    r.headers.reduce(
      (acc, h) => {
        if (h.key && h.value) acc[h.key] = h.value;
        return acc;
      },
      {} as Record<string, string>,
    ),
    null,
    2,
  )}
};

const req = https.request(options, res => {
  let data = "";
  res.on("data", chunk => { data += chunk; });
  res.on("end", () => console.log(data));
});

req.on("error", error => console.error(error));
${r.body ? `req.write(${JSON.stringify(r.body)});` : ''}
req.end();`;
}
