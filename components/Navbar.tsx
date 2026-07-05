'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import NavbarSearch from '@/components/NavbarSearch';
import NavbarCartIcon from '@/components/NavbarCartIcon';

// Added isAdmin as an optional prop
export default function Navbar({ isAdmin }: { isAdmin?: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // We filter the links based on the isAdmin prop
  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    ...(isAdmin ? [{ name: 'Admin Dashboard', href: '/admin/products' }] : []),
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900" onClick={closeMenu}>
            NMC
          </Link>

          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-bold transition-colors ${
                  pathname === link.href ? 'text-[#0F4C5C]' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <NavbarSearch />
            <Link href="/profile" className="text-gray-600 hover:text-black transition"><User className="w-5 h-5" /></Link>
            <NavbarCartIcon />
            
            <button 
              className="md:hidden text-gray-900 p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={closeMenu}
                className={`text-lg font-bold px-4 py-3 rounded-xl ${
                  pathname === link.href ? 'bg-gray-50 text-[#0F4C5C]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}