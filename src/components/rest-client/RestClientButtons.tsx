import React from 'react';

interface RestClientButtonsProps {
  onSendRequest?: () => void;
  onPrettify?: () => void;
  onAddHeader?: () => void;
}

export function RestClientButtons({
  onSendRequest,
  onPrettify,
  onAddHeader,
}: RestClientButtonsProps) {
  return (
    <div className="flex gap-2 my-2">
      {onSendRequest && (
        <button onClick={onSendRequest} className="px-4 py-2 bg-blue-600 text-white rounded">
          Send Request
        </button>
      )}
      {onPrettify && (
        <button onClick={onPrettify} className="px-3 py-1 bg-gray-200 rounded">
          Prettify
        </button>
      )}
      {onAddHeader && (
        <button
          onClick={onAddHeader}
          className="px-4 py-2 text-md font-medium text-white bg-blue-500 rounded-md"
        >
          + Add Header
        </button>
      )}
    </div>
  );
}
