import { HttpRequestSnapshot } from '../types';

export function generateJsFetch(req: HttpRequestSnapshot): string {
  const headers = req.headers.reduce(
    (acc, h) => {
      if (h.key && h.value) acc[h.key] = h.value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return `fetch("${req.url}", {
  method: "${req.method}",
  headers: ${JSON.stringify(headers, null, 2)},
  body: ${req.body ? JSON.stringify(req.body) : 'undefined'}
}).then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;
}
