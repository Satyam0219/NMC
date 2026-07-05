'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Eye } from 'lucide-react';
import MessageStatusDropdown from './MessageStatusDropdown';

interface Message {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function MessageRow({ msg }: { msg: Message }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalContent = isModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-900">Message Details</h3>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">From</p>
            <p className="font-medium text-gray-900">{msg.first_name} {msg.last_name}</p>
            <p className="text-sm text-gray-500">{msg.email}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Subject</p>
            <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">
              {msg.subject}
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message</p>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
              {msg.message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <tr className={`transition-colors ${msg.status === 'unread' ? 'bg-white font-medium text-gray-900' : 'bg-gray-50/50 text-gray-500'}`}>
        <td className="px-6 py-4 whitespace-nowrap" suppressHydrationWarning>
          {new Date(msg.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </td>
        {/* Added truncate to this column to prevent long emails breaking the table */}
        <td className="px-6 py-4 overflow-hidden">
          <p className="font-bold truncate">{msg.first_name} {msg.last_name}</p>
          <p className="text-xs text-gray-400 truncate">{msg.email}</p>
        </td>
        {/* Added truncate to the subject block */}
        <td className="px-6 py-4 overflow-hidden">
          <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold truncate max-w-full">
            {msg.subject}
          </span>
        </td>
        <td className="px-6 py-4">
          <div 
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-between gap-2 cursor-pointer"
          >
            <p className="truncate text-gray-600 group-hover:text-black transition-colors">
              {msg.message}
            </p>
            <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <MessageStatusDropdown messageId={msg.id} currentStatus={msg.status} />
        </td>
      </tr>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}