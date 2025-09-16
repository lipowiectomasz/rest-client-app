export interface ProxyMetrics {
  durationMs: number;
  requestSize: number;
  responseSize: number;
}

export interface ProxySuccess {
  status: number;
  headers: Record<string, string>;
  body: string | object;
  metrics: ProxyMetrics;
}

export interface ProxyError {
  error: string;
}

export type ProxyResponse = ProxySuccess | ProxyError;
