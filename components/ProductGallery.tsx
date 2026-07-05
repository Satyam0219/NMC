'use client';

import { useState } from 'react';
import { Heart, Share, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ mainImage, productName }: { mainImage: string, productName: string }) {
  // Faking a gallery array using the main image to match the visual layout
  const images = [mainImage, mainImage, mainImage, mainImage, mainImage];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div className="relative aspect-3/4 bg-gray-50 rounded-2xl overflow-hidden group border border-gray-100">
        <img 
          src={images[currentIndex] || 'https://via.placeholder.com/800'} 
          alt={`${productName} - View ${currentIndex + 1}`} 
          className="w-full h-full object-cover"
        />
        
        {/* Floating Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition text-gray-700 hover:text-[#0F4C5C]">
            <Share className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition text-gray-700 hover:text-red-500">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Arrows */}
        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition text-gray-700 hover:text-[#0F4C5C]">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition text-gray-700 hover:text-[#0F4C5C]">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
              currentIndex === idx ? 'border-[#0F4C5C]' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}