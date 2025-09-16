'use client';
import { useRouter, usePathname } from 'next/navigation';

const METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

export function MethodSelector({
  initialMethod,
  onChange,
}: {
  initialMethod: string;
  onChange?: (method: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(newMethod: string) {
    // cambia solo el último segmento de la URL
    const segments = pathname.split('/');
    segments[segments.length - 1] = newMethod;
    router.replace(segments.join('/'));
    if (onChange) {
      onChange(newMethod);
    }
  }

  return (
    <select
      name="methods"
      value={initialMethod}
      onChange={(e) => handleChange(e.target.value)}
      className="dark:bg-slate-800 bg-slate-100 rounded-b-lg shadow-sm shadow-indigo-600 px-3 py-2 my-2 text-md border border-indigo-200 rounded-md text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {METHODS.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  );
}
