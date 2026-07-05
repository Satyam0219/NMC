'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ShoppingBag } from 'lucide-react';

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-8">
        <Link
          href="/admin/products"
          className={`whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            pathname.includes('/admin/products')
              ? 'border-[#0F4C5C] text-[#0F4C5C]'
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <Package className="mr-2 h-5 w-5" />
          Manage Products
        </Link>

        <Link
          href="/admin/orders"
          className={`whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            pathname.includes('/admin/orders')
              ? 'border-[#0F4C5C] text-[#0F4C5C]'
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Manage Orders
        </Link>
      </nav>
    </div>
  );
}