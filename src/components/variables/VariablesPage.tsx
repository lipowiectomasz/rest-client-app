'use client';

import React, { useState, useEffect } from 'react';
import {
  Variable,
  loadVariables,
  addVariable,
  removeVariable,
} from '@/lib/variables/variablesStorage';
import Box from '../ui/Box';

export default function VariablesPage() {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    setVariables(loadVariables());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    const updated = addVariable(variables, { key: key.trim(), value });
    setVariables(updated);
    setKey('');
    setValue('');
  };

  const handleRemove = (k: string) => {
    const updated = removeVariable(variables, k);
    setVariables(updated);
  };

  return (
    <section className="max-w-screen-lg mx-auto">
      <h1 className="py-4 text-3xl text-indigo-600">Variables</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-2 md:flex-row flex-col">
        <input
          name="Key"
          className="w-full px-2 my-2 py-2 text-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 rounded-md inset-shadow-sm inset-shadow-slate-300 dark:inset-shadow-gray-600 text-indigo-900"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
        />
        <input
          name="Value"
          className="w-full px-2 my-2 py-2 text-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 rounded-md inset-shadow-sm inset-shadow-slate-300 dark:inset-shadow-gray-600 text-indigo-900"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="submit"
          className="dark:bg-slate-800 bg-slate-100 shadow-sm shadow-indigo-600 px-3 py-2 my-2 text-md border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add
        </button>
      </form>
      <Box className="!my-0 py-4 rounded-b-lg">
        <table className="min-w-full text-left table-fixed border-collapse">
          <thead>
            <tr className="text-indigo-600 text-center">
              <th className="px-3 py-2 border-r border-b border-indigo-200">#</th>
              <th className="px-3 py-2 border-r border-b border-indigo-200">Value</th>
              <th className="px-3 py-2  border-b border-indigo-200">Remove</th>
            </tr>
          </thead>
          <tbody>
            {variables.length === 0 && (
              <tr>
                <td colSpan={3} className="border-b border-indigo-200text-slate-500 px-3 py-2">
                  No variables
                </td>
              </tr>
            )}
            {variables.map((v, idx) => {
              const isLast = idx === variables.length - 1;
              const borderClass = isLast ? 'border-indigo-200' : 'border-b border-indigo-200';
              return (
                <tr
                  key={v.key}
                  className="odd:bg-slate-50 even:bg-white dark:odd:bg-slate-800 dark:even:bg-slate-900"
                >
                  <td className={`border-r px-2 py-2 font-mono text-gray-500 ${borderClass}`}>
                    {idx + 1}
                  </td>
                  <td className={`border-r px-2 py-2 ${borderClass}`}>
                    <span className="font-semibold">{v.key}</span>: {v.value}
                  </td>
                  <td className={` px-2 py-2 text-center ${borderClass}`}>
                    <button
                      onClick={() => handleRemove(v.key)}
                      aria-label={`Remove ${v.key}`}
                      className="text-red-600 font-medium hover:underline"
                    >
                      X
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </section>
  );
}
