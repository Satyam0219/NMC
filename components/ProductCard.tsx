'use client';

import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url || 'https://via.placeholder.com/400'
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white group flex flex-col h-full hover:shadow-2xl transition-shadow duration-300 pb-6">
      
      {/* Image Section (Light Gray Background) */}
      <Link href={`/products/${product.id}`} className="relative aspect-square w-full bg-[#EAEAEA] overflow-hidden block mb-6">
        <img 
          src={product.image_url || 'https://via.placeholder.com/400'} 
          alt={product.name}
          className="object-cover w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
        />
      </Link>
      
      {/* Text Content */}
      <div className="px-6 flex flex-col flex-grow">
        <Link href={`/products/${product.id}`} className="block mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-[#0F4C5C] transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-[#888888] text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
          {product.description}
        </p>
        
        {/* Price Section with Divider */}
        <div className="mt-auto flex flex-col items-center pt-2">
          <div className="w-8 h-[1px] bg-gray-300 mb-4"></div>
          <span className="text-lg font-extrabold text-gray-900 mb-4">
            ₹{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          
          <button 
            onClick={handleAddToCart}
            className="w-full bg-transparent border-2 border-gray-900 text-gray-900 px-4 py-2.5 font-bold text-sm hover:bg-gray-900 hover:text-white transition-colors duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}