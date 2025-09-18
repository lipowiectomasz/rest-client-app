import { HttpRequestSnapshot } from '../types';

export function generateNode(req: HttpRequestSnapshot): string {
  const url = new URL(req.url);
  return `const https = require("https");

const options = {
  hostname: "${url.hostname}",
  port: ${url.port || 443},
  path: "${url.pathname}${url.search}",
  method: "${req.method}",
  headers: ${JSON.stringify(
    req.headers.reduce(
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
${req.body ? `req.write(${JSON.stringify(req.body)});` : ''}
req.end();`;
}
