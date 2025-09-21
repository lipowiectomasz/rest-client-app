'use client';
const METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

export function MethodSelector({
  initialMethod,
  onChange,
}: {
  initialMethod: string;
  onChange?: (method: string) => void;
}) {
  function handleChange(newMethod: string) {
    if (onChange) {
      onChange(newMethod);
    }
  }

  return (
    <select
      name="methods"
      value={initialMethod}
      onChange={(e) => handleChange(e.target.value)}
      className="dark:bg-slate-800 bg-slate-100 shadow-sm shadow-indigo-600 px-3 py-2 my-2 text-md border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {METHODS.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  );
}
