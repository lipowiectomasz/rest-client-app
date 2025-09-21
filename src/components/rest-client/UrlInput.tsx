'use client';
import { useState, useEffect } from 'react';

export function UrlInput({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [url, setUrl] = useState(value ?? '');

  useEffect(() => {
    setUrl(value ?? '');
  }, [value]);

  function handleChange(value: string) {
    setUrl(value);
    onChange(value);
  }

  return (
    <input
      id="url-input"
      name="url"
      type="text"
      required
      value={url}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="https://api.example.com"
      className="w-full px-2 my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 rounded-md inset-shadow-sm inset-shadow-slate-300 dark:inset-shadow-gray-600 text-black"
    />
  );
}
