'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitContactMessage } from '@/app/actions/contact';
import WholesaleModal from '@/components/WholesaleModal'; // <-- Import the new modal!

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- Track modal state

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      first_name: formData.get('firstName') as string,
      last_name: formData.get('lastName') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    const result = await submitContactMessage(data);

    if (result.success) {
      toast.success('Message sent! We will get back to you shortly.');
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error('Failed to send message. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[#F9F9F9] py-12 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Get in touch
          </h1>
          <p className="text-lg text-gray-500">
            Whether you have a question about our formulations, need help with an order, or want to discuss a clinical partnership, our team is ready to assist.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
          
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Email Us</p>
                    <p className="text-sm text-gray-500 mt-1">support@nmchygiene.com</p>
                    <p className="text-sm text-gray-500">b2b@nmchygiene.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Call Us</p>
                    <p className="text-sm text-gray-500 mt-1">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Headquarters</p>
                    <p className="text-sm text-gray-500 mt-1">
                      123 Hygiene Park, Clinical Sector<br />
                      Solapur, Maharashtra 413001<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Business Hours</p>
                    <p className="text-sm text-gray-500 mt-1">Monday - Friday: 9AM - 6PM IST</p>
                    <p className="text-sm text-gray-500">Weekend: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wholesale Banner */}
            <div className="bg-[#0F4C5C] p-8 rounded-3xl shadow-sm text-white">
              <div className="flex items-center gap-3 mb-3">
                <Building className="w-6 h-6 text-blue-200" />
                <h3 className="text-lg font-bold">Wholesale & Clinical</h3>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Are you procuring for a hospital, clinic, or large facility? Contact our B2B team for volume pricing and specialized dispensing systems.
              </p>
              {/* TRIGGER BUTTON CONNECTED HERE */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-[#0F4C5C] w-full py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition"
              >
                Request Bulk Quote
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input type="text" id="firstName" name="firstName" required className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors" placeholder="John" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input type="text" id="lastName" name="lastName" required className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input type="email" id="email" name="email" required className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors" placeholder="john@example.com" />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <select id="subject" name="subject" className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors">
                  <option>Order Support</option>
                  <option>Product Inquiry</option>
                  <option>Wholesale & Distribution</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea id="message" name="message" rows={5} required className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors resize-none" placeholder="How can we help you?"></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white flex items-center justify-center gap-2 py-4 rounded-xl font-bold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                {isSubmitting ? 'Sending...' : 'Send Message'} 
                {!isSubmitting && <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* RENDER THE MODAL HERE */}
      <WholesaleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </main>
  );
}