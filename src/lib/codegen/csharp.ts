import { HttpRequestSnapshot } from '../types';
import type { Variable } from '@/lib/variables/variablesStorage';
import { applyVariablesToRequest } from './applyVariables';

export function generateCSharp(req: HttpRequestSnapshot, vars: Variable[] = []): string {
  const r = applyVariablesToRequest(req, vars);

  return `using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program {
  static async Task Main() {
    using var client = new HttpClient();
    var request = new HttpRequestMessage(HttpMethod.${r.method}, "${r.url}");
${r.headers.map((h) => `    request.Headers.Add("${h.key}", "${h.value}");`).join('\n')}
${r.body ? `    request.Content = new StringContent("${r.body}");` : ''}

    var response = await client.SendAsync(request);
    string result = await response.Content.ReadAsStringAsync();
    Console.WriteLine(result);
  }
}`;
}
