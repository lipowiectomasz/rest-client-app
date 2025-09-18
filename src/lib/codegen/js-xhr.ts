import { HttpRequestSnapshot } from '../types';

export function generateJsXhr(req: HttpRequestSnapshot): string {
  const headers = req.headers
    .map((h) => `xhr.setRequestHeader("${h.key}", "${h.value}");`)
    .join('\n');

  return `const xhr = new XMLHttpRequest();
xhr.open("${req.method}", "${req.url}");
${headers}
xhr.onload = () => {
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log(xhr.responseText);
  } else {
    console.error("Request failed:", xhr.statusText);
  }
};
xhr.onerror = () => console.error("Network error");
${req.body ? `xhr.send(${JSON.stringify(req.body)});` : 'xhr.send();'}`;
}
