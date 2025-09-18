import { HttpRequestSnapshot } from '../types';

export function generatePython(req: HttpRequestSnapshot): string {
  const headers = req.headers.reduce(
    (acc, h) => {
      if (h.key && h.value) acc[h.key] = h.value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return `import requests

url = "${req.url}"
payload = ${req.body ? JSON.stringify(req.body, null, 2) : 'None'}
headers = ${JSON.stringify(headers, null, 2)}

response = requests.request("${req.method}", url, headers=headers, data=payload)

print(response.text)`;
}
