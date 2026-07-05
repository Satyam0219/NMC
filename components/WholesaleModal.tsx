'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Building, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitContactMessage } from '@/app/actions/contact';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function WholesaleModal({ isOpen, onClose }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    // We format the specific B2B questions into the standard "message" field!
    const company = formData.get('company') as string;
    const phone = formData.get('phone') as string;
    const volume = formData.get('volume') as string;
    const details = formData.get('details') as string;
    
    const formattedMessage = `COMPANY: ${company}\nPHONE: ${phone}\nEXPECTED VOLUME: ${volume}\n\nDETAILS:\n${details}`;

    const data = {
      first_name: formData.get('firstName') as string,
      last_name: formData.get('lastName') as string,
      email: formData.get('email') as string,
      subject: 'WHOLESALE & CLINICAL INQUIRY', // Force a special subject line
      message: formattedMessage,
    };

    const result = await submitContactMessage(data);

    if (result.success) {
      toast.success('Quote request sent! Our B2B team will contact you soon.');
      onClose(); // Close the modal on success
    } else {
      toast.error('Failed to send request. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#0F4C5C] text-white p-2 rounded-lg">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">Request Bulk Quote</h3>
              <p className="text-xs text-gray-500">Clinical Partnerships & B2B Distribution</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-8 overflow-y-auto">
          <form id="wholesale-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Company / Facility Name</label>
              <input type="text" name="company" required className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" placeholder="e.g. City General Hospital" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Contact First Name</label>
                <input type="text" name="firstName" required className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Contact Last Name</label>
                <input type="text" name="lastName" required className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Work Email</label>
                <input type="email" name="email" required className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Direct Phone</label>
                <input type="tel" name="phone" required className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Monthly Volume</label>
              <select name="volume" className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]">
                <option>Less than 50 Liters/Units</option>
                <option>50 - 200 Liters/Units</option>
                <option>200 - 1000 Liters/Units</option>
                <option>1000+ Liters/Units (Enterprise)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Additional Details</label>
              <textarea name="details" rows={3} required className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] resize-none" placeholder="Tell us about your specific hygiene requirements..."></textarea>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="wholesale-form" // Links this button to the form above
            disabled={isSubmitting}
            className="bg-[#0F4C5C] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0a3642] transition flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? 'Sending...' : 'Submit Request'}
            {!isSubmitting && <Send className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}