import { HttpRequestSnapshot } from '../types';

export function generateCSharp(req: HttpRequestSnapshot): string {
  return `using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program {
  static async Task Main() {
    using var client = new HttpClient();
    var request = new HttpRequestMessage(HttpMethod.${req.method}, "${req.url}");
${req.headers.map((h) => `    request.Headers.Add("${h.key}", "${h.value}");`).join('\n')}
${req.body ? `    request.Content = new StringContent("${req.body}");` : ''}

    var response = await client.SendAsync(request);
    string result = await response.Content.ReadAsStringAsync();
    Console.WriteLine(result);
  }
}`;
}
