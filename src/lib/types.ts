export type HeaderKV = { key: string; value: string };
export type HttpRequestSnapshot = {
  method: string;
  url: string;
  headers: HeaderKV[];
  body?: string;
};
