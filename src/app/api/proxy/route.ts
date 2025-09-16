import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const payload = await req.json(); // { url, method, headers, body }
  const { url, method = 'GET', headers = {}, body } = payload;

  const t0 = process.hrtime.bigint();

  try {
    const fetchRes = await fetch(url, {
      method,
      headers,
      body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    });

    const text = await fetchRes.text();
    const t1 = process.hrtime.bigint();
    const durationMs = Number(t1 - t0) / 1_000_000;

    // Medidas básicas (aún no guardamos en DB)
    const requestSize = body
      ? new TextEncoder().encode(typeof body === 'string' ? body : JSON.stringify(body)).length
      : 0;
    const responseSize = new TextEncoder().encode(text).length;

    // Intentar parsear JSON si aplica
    let parsed: unknown = text;
    try {
      parsed = JSON.parse(text);
    } catch {
      // keep as plain text
    }

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
