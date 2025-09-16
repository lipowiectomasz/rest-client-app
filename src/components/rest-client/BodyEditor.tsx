'use client';
import { useState } from 'react';
import Box from '../ui/Box';
import { RestClientButtons } from '@/components/rest-client';

export function BodyEditor({ onChange }: { onChange: (body: string) => void }) {
  const [body, setBody] = useState('');

  function prettify() {
    try {
      setBody(JSON.stringify(JSON.parse(body), null, 2));
    } catch {
      alert('Invalid JSON');
    }
  }

  return (
    <div>
      <Box className="py-0 !px-0 md:!mt-0 justify-start min-h-auto !rounded-md focus-within:ring-2 focus-within:ring-indigo-500">
        <textarea
          name="request-body"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            onChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              e.preventDefault();
              const textarea = e.currentTarget;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const newValue = body.substring(0, start) + '\t' + body.substring(end);
              setBody(newValue);
              onChange(newValue);
              setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 1;
              }, 0);
            }
          }}
          placeholder="Request body (JSON)"
          className="w-full min-h-[150px] px-2 pt-2 border-none focus:outline-none "
        />
      </Box>
      <RestClientButtons onPrettify={prettify} />
    </div>
  );
}
