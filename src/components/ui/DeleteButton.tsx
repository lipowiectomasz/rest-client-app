'use client';

import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

interface DeleteButtonProps {
  historyId: string;
  onDelete: (id: string) => void;
}

export default function DeleteButton({ historyId, onDelete }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this history item?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/history/${historyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(historyId);
      } else {
        console.error('Failed to delete history item');
        alert('Failed to delete history item');
      }
    } catch (error) {
      console.error('Error deleting history item:', error);
      alert('Error deleting history item');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
      title="Delete this request"
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
