import { HttpRequestSnapshot } from '../types';

export function generateJava(req: HttpRequestSnapshot): string {
  return `import java.io.*;
import java.net.*;

public class Main {
  public static void main(String[] args) throws Exception {
    URL url = new URL("${req.url}");
    HttpURLConnection con = (HttpURLConnection) url.openConnection();
    con.setRequestMethod("${req.method}");
${req.headers.map((h) => `    con.setRequestProperty("${h.key}", "${h.value}");`).join('\n')}
${req.body ? `    con.setDoOutput(true);\n    try(OutputStream os = con.getOutputStream()) {\n      byte[] input = "${req.body}".getBytes("utf-8");\n      os.write(input, 0, input.length);\n    }` : ''}

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
