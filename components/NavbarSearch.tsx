'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NavbarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Automatically focus the input box when the user clicks the search icon
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Send the user to the shop page with their search term in the URL
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false); // Close the search bar
      setQuery('');     // Clear the input
    }
  };

  return (
    <div className="relative flex items-center h-5">
      {isOpen ? (
        <form 
          onSubmit={handleSearch} 
          className="absolute right-0 flex items-center bg-white border border-gray-200 rounded-full pl-3 pr-1 py-1 shadow-md w-48 sm:w-64 z-50 animate-in fade-in slide-in-from-right-4 duration-200"
        >
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none text-sm px-2 py-1 text-gray-900 placeholder-gray-400"
          />
          <button 
            type="button" 
            onClick={() => setIsOpen(false)} 
            className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="text-gray-900 hover:text-gray-500 transition"
          aria-label="Open search"
        >
          <Search className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}