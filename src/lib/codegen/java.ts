import { HttpRequestSnapshot } from '../types';
import type { Variable } from '@/lib/variables/variablesStorage';
import { applyVariablesToRequest } from './applyVariables';

export function generateJava(req: HttpRequestSnapshot, vars: Variable[] = []): string {
  const r = applyVariablesToRequest(req, vars);

  return `import java.io.*;
import java.net.*;

public class Main {
  public static void main(String[] args) throws Exception {
    URL url = new URL("${r.url}");
    HttpURLConnection con = (HttpURLConnection) url.openConnection();
    con.setRequestMethod("${r.method}");
${r.headers.map((h) => `    con.setRequestProperty("${h.key}", "${h.value}");`).join('\n')}
${r.body ? `    con.setDoOutput(true);\n    try(OutputStream os = con.getOutputStream()) {\n      byte[] input = "${r.body}".getBytes("utf-8");\n      os.write(input, 0, input.length);\n    }` : ''}

    BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
    String inputLine;
    StringBuffer content = new StringBuffer();
    while ((inputLine = in.readLine()) != null) {
      content.append(inputLine);
    }
    in.close();
    con.disconnect();
    System.out.println(content.toString());
  }
}`;
}
