'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';

export default function NavbarCartIcon() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors by only rendering the badge after the component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/cart" className="text-gray-900 hover:text-gray-500 transition relative flex items-center">
      <ShoppingBag className="w-5 h-5" />
      {mounted && itemCount > 0 && (
        <span className="absolute -top-2 -right-2.5 bg-red-500 text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm">
          {itemCount}
        </span>
      )}
    </Link>
  );
}