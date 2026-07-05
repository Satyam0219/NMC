'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';

export default function ProductActions({ product }: { product: any }) {
  // Tailored for NMC Hygiene Products
  const formulations = [
    { name: 'Fragrance-Free (Clinical)', hex: '#ffffff', border: '#e5e7eb' },
    { name: 'Citrus Breeze', hex: '#fef3c7', border: '#fde68a' },
    { name: 'Soothing Aloe', hex: '#dcfce7', border: '#bbf7d0' },
  ];
  
  const volumes = ['50ml Travel', '250ml Desk', '500ml Pump', '5L Refill'];

  const [selectedFormulation, setSelectedFormulation] = useState(formulations[0]);
  const [selectedVolume, setSelectedVolume] = useState(volumes[2]);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: `${product.name} - ${selectedVolume} / ${selectedFormulation.name}`,
      price: product.discount_price || product.price,
      quantity: 1,
      image_url: product.image_url || '/placeholder.png'
    });
    toast.success(`Added to cart!`);
  };

  return (
    <div className="mt-8 space-y-8">
      
      {/* Formulation / Scent Selector */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-gray-900">Formulation:</span>
          <span className="text-sm font-semibold text-[#0F4C5C]">{selectedFormulation.name}</span>
        </div>
        <div className="flex gap-3">
          {formulations.map((form) => (
            <button
              key={form.name}
              onClick={() => setSelectedFormulation(form)}
              className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                selectedFormulation.name === form.name ? 'border-[#0F4C5C] p-0.5' : 'border-transparent'
              }`}
            >
              <div 
                className="w-full h-full rounded-full shadow-sm" 
                style={{ backgroundColor: form.hex, border: `1px solid ${form.border}` }} 
              />
            </button>
          ))}
        </div>
      </div>

      {/* Volume / Size Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-900">Volume: <span className="font-bold">{selectedVolume}</span></span>
          <button className="text-sm text-gray-500 underline hover:text-[#0F4C5C] transition flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Ingredients Data
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {volumes.map((vol) => (
            <button
              key={vol}
              onClick={() => setSelectedVolume(vol)}
              className={`py-3 text-sm font-semibold rounded-lg border-2 transition-all ${
                selectedVolume === vol 
                  ? 'border-[#0F4C5C] bg-[#0F4C5C]/5 text-[#0F4C5C]' 
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {vol}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-[#0F4C5C] text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-[#0F4C5C]/20 hover:bg-[#0a3642] hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          Add To Cart
        </button>
        <button 
          className="flex-1 bg-white text-[#0F4C5C] border-2 border-[#0F4C5C] py-4 rounded-xl font-bold text-base hover:bg-gray-50 transition-colors"
        >
          Checkout Now
        </button>
      </div>

      <div className="pt-2 text-center sm:text-left">
        <button className="text-sm text-gray-500 underline hover:text-gray-900 transition">
          Shipping & Return Policies
        </button>
      </div>
    </div>
  );
}