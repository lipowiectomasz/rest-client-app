import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (typeof payload !== 'object' || payload === null) {
    return NextResponse.json({ error: 'Payload must be an object' }, { status: 400 });
  }

  const {
    url,
    method = 'GET',
    headers = {},
    body,
  } = payload as {
    url?: unknown;
    method?: unknown;
    headers?: unknown;
    body?: unknown;
  };

  if (typeof url !== 'string' || url.trim() === '') {
    return NextResponse.json({ error: 'Invalid or missing URL' }, { status: 400 });
  }

  if (typeof method !== 'string') {
    return NextResponse.json({ error: 'Invalid HTTP method' }, { status: 400 });
  }

  const safeHeaders: Record<string, string> = {};
  if (headers && typeof headers === 'object') {
    for (const [key, value] of Object.entries(headers as Record<string, unknown>)) {
      if (typeof value === 'string') {
        safeHeaders[key] = value;
      }
    }
  }

  const t0 = process.hrtime.bigint();

  try {
    const fetchRes = await fetch(url, {
      method,
      headers: safeHeaders,
      body:
        body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    });

    const text = await fetchRes.text();
    const t1 = process.hrtime.bigint();
    const durationMs = Number(t1 - t0) / 1_000_000;

    const requestSize =
      body !== undefined
        ? new TextEncoder().encode(typeof body === 'string' ? body : JSON.stringify(body)).length
        : 0;

    const responseSize = new TextEncoder().encode(text).length;

    let parsed: unknown = text;
    try {
      parsed = JSON.parse(text);
    } catch {}

    return NextResponse.json(
      {
        status: fetchRes.status,
        headers: Object.fromEntries(fetchRes.headers),
        body: parsed,
        metrics: {
          durationMs: Math.round(durationMs),
          requestSize,
          responseSize,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: String(err instanceof Error ? err.message : err) },
      { status: 500 },
    );
  }
}
