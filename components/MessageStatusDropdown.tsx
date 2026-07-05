'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { updateMessageStatus } from '@/app/actions/contact';

interface Props {
  messageId: string;
  currentStatus: string;
}

export default function MessageStatusDropdown({ messageId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus || 'unread');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);

    const toastId = toast.loading('Updating...');
    const result = await updateMessageStatus(messageId, newStatus);
    
    if (result.success) {
      toast.success('Status updated!', { id: toastId });
    } else {
      toast.error('Failed to update', { id: toastId });
      setStatus(currentStatus); 
    }
    
    setIsUpdating(false);
  };

  return (
    <select
      value={status}
      onChange={handleStatusChange}
      disabled={isUpdating}
      className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-0 cursor-pointer outline-none ring-1 ring-inset ring-black/5 hover:ring-black/20 transition-all disabled:opacity-50 ${
        status === 'unread' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'
      }`}
    >
      <option value="unread" className="text-gray-900 bg-white">Unread</option>
      <option value="read" className="text-gray-900 bg-white">Read</option>
    </select>
  );
}