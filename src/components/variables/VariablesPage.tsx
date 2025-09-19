'use client';

import React, { useState, useEffect } from 'react';
import {
  Variable,
  loadVariables,
  addVariable,
  removeVariable,
} from '@/lib/variables/variablesStorage';

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
    <div className="max-w-screen-lg mx-auto">
      <h1 className="text-3xl text-indigo-600">Variables</h1>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Key" value={key} onChange={(e) => setKey(e.target.value)} required />
        <input placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {variables.length === 0 && <li>No variables</li>}
        {variables.map((v) => (
          <li
            key={v.key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>
              {v.key}: {v.value}
            </span>
            <button onClick={() => handleRemove(v.key)} aria-label={`Remove ${v.key}`}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
