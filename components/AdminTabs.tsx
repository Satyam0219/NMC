'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ShoppingBag, Mail } from 'lucide-react'; // Added Mail icon

export default function AdminTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Dashboard', href: '/admin', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Messages', href: '/admin/messages', icon: Mail }, // <-- NEW TAB
  ];

  return (
    <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
              isActive 
                ? 'bg-black text-white shadow-sm' 
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}