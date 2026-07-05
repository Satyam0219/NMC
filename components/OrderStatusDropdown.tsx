'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { updateOrderStatus } from '@/app/actions/orders';

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusDropdown({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);

    const toastId = toast.loading('Updating status...');
    
    const result = await updateOrderStatus(orderId, newStatus);
    
    if (result.success) {
      toast.success('Order status updated!', { id: toastId });
    } else {
      toast.error('Failed to update status', { id: toastId });
      setStatus(currentStatus); // Revert UI on failure
    }
    
    setIsUpdating(false);
  };

  // Determine badge styling based on status
  let bgClass = 'bg-gray-100 text-gray-700';
  if (status === 'processing') bgClass = 'bg-yellow-100 text-yellow-700';
  if (status === 'shipped') bgClass = 'bg-blue-100 text-blue-700';
  if (status === 'delivered') bgClass = 'bg-green-100 text-green-700';
  if (status === 'cancelled') bgClass = 'bg-red-100 text-red-700';

  return (
    <select
      value={status}
      onChange={handleStatusChange}
      disabled={isUpdating}
      className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-0 cursor-pointer outline-none ring-1 ring-inset ring-black/5 hover:ring-black/20 transition-all ${bgClass} disabled:opacity-50`}
    >
      <option value="pending_payment" className="text-gray-900 bg-white">Pending</option>
      <option value="processing" className="text-gray-900 bg-white">Processing</option>
      <option value="shipped" className="text-gray-900 bg-white">Shipped</option>
      <option value="delivered" className="text-gray-900 bg-white">Delivered</option>
      <option value="cancelled" className="text-gray-900 bg-white">Cancelled</option>
    </select>
  );
}