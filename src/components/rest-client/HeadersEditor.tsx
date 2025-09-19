'use client';
import { useState, useEffect, useRef } from 'react';
import { COMMON_HEADER_KEYS } from '@/data/commonHeaderKeys';

interface Header {
  key: string;
  value: string;
}

export function HeadersEditor({
  value,
  onChange,
}: {
  value: Header[];
  onChange: (h: Header[]) => void;
}) {
  const [headers, setHeaders] = useState<Header[]>(value ?? []);

  useEffect(() => {
    setHeaders(value ?? []);
  }, [value]);

  function updateHeader(index: number, field: keyof Header, value: string) {
    const newHeaders = headers.map((h, i) => (i === index ? { ...h, [field]: value } : h));
    setHeaders(newHeaders);
    onChange(newHeaders);
  }

  // Dropdown state for each header key input
  const [dropdownIdx, setDropdownIdx] = useState<number | null>(null);
  const [filter, setFilter] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownIdx(null);
      }
    }
    if (dropdownIdx !== null) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownIdx]);

  function removeHeader(index: number) {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
    onChange(newHeaders);
  }

  return (
    <div className="space-y-2">
      {headers.map((header, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <div className="relative w-full">
            <input
              name="key"
              placeholder="Header Key"
              value={header.key}
              autoComplete="off"
              className="w-full px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 rounded-md inset-shadow-sm inset-shadow-slate-300 dark:inset-shadow-gray-600"
              onFocus={() => {
                setDropdownIdx(idx);
                setFilter(header.key);
              }}
              onChange={(e) => {
                updateHeader(idx, 'key', e.target.value);
                setFilter(e.target.value);
                setDropdownIdx(idx);
              }}
            />
            {dropdownIdx === idx && (
              <div
                ref={dropdownRef}
                className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded shadow max-h-48 overflow-auto"
              >
                {COMMON_HEADER_KEYS.filter((key) =>
                  key.toLowerCase().includes(filter.toLowerCase()),
                ).length === 0 && <div className="px-3 py-2 text-gray-400">No matches</div>}
                {COMMON_HEADER_KEYS.filter((key) =>
                  key.toLowerCase().includes(filter.toLowerCase()),
                ).map((key) => (
                  <div
                    key={key}
                    className="px-3 py-2 cursor-pointer hover:bg-indigo-100"
                    onMouseDown={() => {
                      updateHeader(idx, 'key', key);
                      setDropdownIdx(null);
                    }}
                  >
                    {key}
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            name="value"
            placeholder="Header Value"
            value={header.value}
            onChange={(e) => updateHeader(idx, 'value', e.target.value)}
            className="w-full px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 rounded-md inset-shadow-sm inset-shadow-slate-300 dark:inset-shadow-gray-600"
          />
          <button onClick={() => removeHeader(idx)} className="px-2 text-red-500">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
