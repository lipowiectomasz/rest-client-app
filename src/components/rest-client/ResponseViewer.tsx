'use client';
type ResponseData =
  | { status?: number; body?: string | object; error?: string }
  | { key: string; value: string }[]
  | { error: string }
  | null;

export function ResponseViewer({ response }: { response: ResponseData }) {
  if (!response) return <p>No response yet</p>;

  // Si es un array de headers/pares clave-valor
  if (Array.isArray(response)) {
    return (
      <div className="border p-4 rounded bg-gray-50 mt-4">
        <p className="font-bold">Response:</p>
        <ul className="mt-2">
          {response.map((item, idx) => (
            <li key={idx}>
              <span className="font-mono">{item.key}:</span>{' '}
              <span className="font-mono">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Si es un objeto con error
  if ('error' in response && response.error) {
    return (
      <div className="border p-4 rounded bg-gray-50 mt-4">
        <p className="text-red-500">Error: {response.error}</p>
      </div>
    );
  }

  // Si es un objeto con status/body
  return (
    <div className="border p-4 rounded bg-gray-50 mt-4">
      {'status' in response && response.status !== undefined && <p>Status: {response.status}</p>}
      {'body' in response && response.body !== undefined && (
        <pre className="mt-2 bg-black text-green-300 p-2 rounded overflow-x-auto">
          {typeof response.body === 'string'
            ? response.body
            : JSON.stringify(response.body, null, 2)}
        </pre>
      )}
    </div>
  );
}
