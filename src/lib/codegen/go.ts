import { HttpRequestSnapshot } from '../types';

export function generateGo(req: HttpRequestSnapshot): string {
  return `package main

import (
  "fmt"
  "io/ioutil"
  "net/http"
  "strings"
)

func main() {
  client := &http.Client{}
  req, err := http.NewRequest("${req.method}", "${req.url}", ${
    req.body ? `strings.NewReader("${req.body}")` : 'nil'
  })
  if err != nil {
    panic(err)
  }
${req.headers.map((h) => `  req.Header.Set("${h.key}", "${h.value}")`).join('\n')}

  resp, err := client.Do(req)
  if err != nil {
    panic(err)
  }
  defer resp.Body.Close()

  body, _ := ioutil.ReadAll(resp.Body)
  fmt.Println(string(body))
}`;
}
