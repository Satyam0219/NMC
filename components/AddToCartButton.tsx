'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';
import { ShoppingCart, Minus, Plus } from 'lucide-react';

export default function AddToCartButton({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    // Add the item multiple times or update the cart store to accept initial quantities
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: product.image_url || '/placeholder.png'
      });
    }
    toast.success(`${quantity} ${product.name}(s) added to cart!`);
    setQuantity(1); // Reset after adding
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      {/* Quantity Selector */}
      <div className="flex items-center justify-between border border-gray-200 rounded-full px-4 py-3 sm:w-32 bg-white">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="text-gray-500 hover:text-gray-900 transition"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="font-semibold text-gray-900">{quantity}</span>
        <button 
          onClick={() => setQuantity(quantity + 1)}
          className="text-gray-500 hover:text-gray-900 transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add Button */}
      <button 
        onClick={handleAddToCart}
        className="flex-1 flex items-center justify-center gap-2 bg-[#0F4C5C] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#0a3642] transition-colors shadow-sm"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart — ₹{(product.price * quantity).toLocaleString()}
      </button>
    </div>
  );
}