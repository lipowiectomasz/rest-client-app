import { HttpRequestSnapshot } from '../types';
import type { Variable } from '@/lib/variables/variablesStorage';
import { applyVariablesToRequest } from './applyVariables';

export function generateGo(req: HttpRequestSnapshot, vars: Variable[] = []): string {
  const r = applyVariablesToRequest(req, vars);

  return `package main

import (
  "fmt"
  "io/ioutil"
  "net/http"
  "strings"
)

func main() {
  client := &http.Client{}
  req, err := http.NewRequest("${r.method}", "${r.url}", ${
    r.body ? `strings.NewReader("${r.body}")` : 'nil'
  })
  if err != nil {
    panic(err)
  }
${r.headers.map((h) => `  req.Header.Set("${h.key}", "${h.value}")`).join('\n')}

  resp, err := client.Do(req)
  if err != nil {
    panic(err)
  }
  defer resp.Body.Close()

  body, _ := ioutil.ReadAll(resp.Body)
  fmt.Println(string(body))
}`;
}
