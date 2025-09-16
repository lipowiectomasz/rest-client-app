export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface Header {
  key: string;
  value: string;
}

export interface RestClientInitial {
  locale: string;
  method: HttpMethod;
  url?: string;
  body?: string;
  headers?: Header[];
}
