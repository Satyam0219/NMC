'use client';

import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteProductAction } from '@/app/actions/admin';
import { useState } from 'react';

export default function DeleteProductButton({ id, name }: { id: string, name: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    
    setIsDeleting(true);
    try {
      await deleteProductAction(id);
      toast.success('Product deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}