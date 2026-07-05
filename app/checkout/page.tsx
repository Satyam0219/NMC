'use client';

import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/app/actions/orders';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [shippingMethod, setShippingMethod] = useState('free');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Math Logic matched exactly to Cart
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = items.length > 0 && shippingMethod === 'express' ? 900 : 0;
  const estimatedTaxes = items.length > 0 ? subtotal * 0.18 : 0; 
  const total = items.length > 0 ? subtotal + shippingCost + estimatedTaxes : 0;

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    // Grabbing all the named inputs from the form below
    const orderData = {
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip_code: formData.get('zipCode'),
      payment_method: paymentMethod,
      shipping_method: shippingMethod,
      subtotal,
      shipping_cost: shippingCost,
      taxes: estimatedTaxes,
      total_amount: total,
      status: paymentMethod === 'cod' ? 'processing' : 'pending_payment'
    };

    if (paymentMethod === 'cod') {
      const result = await createOrder(orderData, items);
      
      if (result.success) {
        toast.success('Order placed successfully!');
        clearCart();
        router.push('/'); 
      } else {
        toast.error(result.error || 'Failed to place order');
      }
    } else {
      toast.loading('Redirecting to secure payment gateway...');
      setTimeout(async () => {
        const result = await createOrder(orderData, items);
        toast.dismiss();
        if (result.success) {
          toast.success('Payment successful! Order placed.');
          clearCart();
          router.push('/');
        }
      }, 2000);
    }
    
    setIsSubmitting(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen bg-[#F9F9F9]">
      
      <nav className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-8">
        <Link href="/cart" className="text-[#0055CC] hover:underline">Cart</Link>
        <span>&gt;</span>
        <span className="text-gray-900">Shipping</span>
        <span>&gt;</span>
        <span>Payment</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Column: The Form */}
        <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <form onSubmit={handleOrderSubmit}>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipping Address</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name*</label>
                <input name="firstName" type="text" required placeholder="Divyansh" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name*</label>
                <input name="lastName" type="text" required placeholder="Agarwal" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email*</label>
                <input name="email" type="email" required placeholder="email@example.com" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone number*</label>
                <div className="flex">
                  <select className="border border-gray-300 border-r-0 rounded-l-lg px-3 py-3 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-black">
                    <option>IND</option>
                  </select>
                  <input name="phone" type="tel" required placeholder="+91 9876543210" className="w-full border border-gray-300 rounded-r-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City*</label>
                <input name="city" type="text" required placeholder="Bangalore" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State*</label>
                <input name="state" type="text" required placeholder="Karnataka" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code*</label>
                <input name="zipCode" type="text" required placeholder="560021" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
            </div>

            <div className="mb-12">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address / Instructions*</label>
              <textarea name="address" required rows={4} placeholder="Enter your full address and delivery instructions..." className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"></textarea>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <label className={`border-2 rounded-xl p-5 flex items-center justify-between cursor-pointer transition ${shippingMethod === 'free' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="shipping" checked={shippingMethod === 'free'} onChange={() => setShippingMethod('free')} className="w-5 h-5 accent-black" />
                  <div>
                    <p className="font-bold text-gray-900">Standard Shipping</p>
                    <p className="text-sm text-gray-500">7-10 Days</p>
                  </div>
                </div>
                <span className="font-bold">₹0</span>
              </label>

              <label className={`border-2 rounded-xl p-5 flex items-center justify-between cursor-pointer transition ${shippingMethod === 'express' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="w-5 h-5 accent-black" />
                  <div>
                    <p className="font-bold text-gray-900">Express Shipping</p>
                    <p className="text-sm text-gray-500">1-3 Days</p>
                  </div>
                </div>
                <span className="font-bold">₹900</span>
              </label>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`border-2 rounded-xl p-5 flex items-center justify-between cursor-pointer transition ${paymentMethod === 'online' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="w-5 h-5 accent-black" />
                  <div>
                    <p className="font-bold text-gray-900">Online Payment</p>
                    <p className="text-sm text-gray-500">Cards, UPI, Netbanking</p>
                  </div>
                </div>
              </label>

              <label className={`border-2 rounded-xl p-5 flex items-center justify-between cursor-pointer transition ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 accent-black" />
                  <div>
                    <p className="font-bold text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive</p>
                  </div>
                </div>
              </label>
            </div>
            
            {/* The hidden actual submit button tied to the form */}
            <button id="submit-order-form" type="submit" className="hidden"></button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h3>
            
            <div className="space-y-6 mb-8 max-h-64 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden p-1 border border-gray-100">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{item.name.split(' - ')[0]}</h4>
                  </div>
                  <p className="font-bold text-sm text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-6 border-b border-gray-100 pb-6">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span className="font-bold text-gray-900">₹{shippingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Estimated taxes (18%)</span>
                <span className="font-bold text-gray-900">₹{estimatedTaxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg text-gray-900">Total</span>
              <span className="text-2xl font-black text-gray-900">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            {/* DYNAMIC VISIBLE SUBMIT BUTTON */}
            <button 
              onClick={() => document.getElementById('submit-order-form')?.click()}
              disabled={items.length === 0 || isSubmitting}
              className="w-full bg-black text-white text-center py-4 rounded-xl font-bold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : (paymentMethod === 'cod' ? 'Confirm Order' : 'Make Payment')}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}