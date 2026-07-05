'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [selectAll, setSelectAll] = useState(true);

  // STANDARDIZED MATH LOGIC
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedTaxes = items.length > 0 ? subtotal * 0.18 : 0; // 18% Tax
  const deliveryFee = 0; // Default free shipping preview
  const total = items.length > 0 ? subtotal + estimatedTaxes + deliveryFee : 0;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen bg-[#F9F9F9]">
      
      {/* Progress Tracker */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 mb-16">
        <h1 className="text-3xl font-bold mb-6 sm:mb-0 sm:absolute sm:left-8 top-12">Your Shopping Cart</h1>
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold">1</span>
          <span className="font-bold text-sm text-gray-900 border-b-2 border-gray-900 pb-1">Shopping cart</span>
        </div>
        <div className="hidden sm:block w-12 h-px bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-gray-200 text-gray-400 text-xs rounded-full flex items-center justify-center font-bold">2</span>
          <span className="text-gray-400 font-semibold text-sm">Checkout details</span>
        </div>
        <div className="hidden sm:block w-12 h-px bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-gray-200 text-gray-400 text-xs rounded-full flex items-center justify-center font-bold">3</span>
          <span className="text-gray-400 font-semibold text-sm">Order complete</span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6">Your cart</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Cart Items */}
        <div className="flex-1 space-y-6">
          
          <div className="bg-white rounded-[2rem] p-4 px-6 flex justify-between items-center shadow-sm border border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectAll}
                onChange={() => setSelectAll(!selectAll)}
                className="w-5 h-5 rounded accent-black cursor-pointer" 
              />
              <span className="font-medium text-gray-700">Select All</span>
            </label>
            <button className="bg-black text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-800 transition">
              Delete
            </button>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-6">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
            ) : (
              items.map((item, index) => (
                <div key={item.id} className={`flex items-center gap-6 pb-6 ${index !== items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden p-2">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900">{item.name.split(' - ')[0]}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-600 transition p-1">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{item.name.includes('-') ? item.name.split('-')[1] : 'Standard'}</p>
                    
                    <div className="flex justify-between items-end">
                      <p className="font-bold text-lg text-gray-900">₹{item.price.toLocaleString()}</p>
                      <div className="flex items-center bg-gray-50 rounded-full px-1 py-1">
                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2 hover:bg-gray-200 rounded-full transition">
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-200 rounded-full transition">
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
            
            <div className="flex gap-2 mb-8">
              <input 
                type="text" 
                placeholder="% Coupon Code" 
                className="flex-1 bg-gray-50 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-gray-200 outline-none"
              />
              <button className="bg-black text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-800 transition">
                Apply
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Estimated Taxes (18%)</span>
                <span className="font-bold text-gray-900">₹{estimatedTaxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span className="font-bold text-gray-900">₹{deliveryFee}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mb-8 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-gray-900">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <Link href="/checkout" className="block w-full bg-black text-white text-center py-4 rounded-full font-semibold hover:bg-gray-800 transition">
              Go to Checkout &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}