'use client';
import { b64EncodeUnicode } from '@/app/lib/utils/base64';
import { useState } from 'react';

export function UrlInput({ onChange }: { onChange: (url: string) => void }) {
  const [url, setUrl] = useState('');

  function handleChange(value: string) {
    setUrl(value);
    onChange(b64EncodeUnicode(value));
  }

  return (
    <input
      id="url-input"
      name="url"
      type="text"
      value={url}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="https://api.example.com"
      className="w-full px-2 my-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 rounded-md inset-shadow-sm inset-shadow-slate-300 dark:inset-shadow-gray-600"
    />
  );
}
