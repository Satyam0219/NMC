'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Search } from 'lucide-react';

interface StoreFiltersProps {
  categories: string[];
  layout?: 'tabs' | 'sidebar';
}

export default function StoreFilters({ categories, layout = 'tabs' }: StoreFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Unified router push helper
  const updateFilters = useCallback((cat: string, search: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (cat) params.set('category', cat);
    else params.delete('category');

    if (search) params.set('q', search);
    else params.delete('q');

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(currentCategory, searchTerm);
  };

  // --- RENDERING LAYOUT 1: SIDEBAR (For the dedicated /shop page) ---
  if (layout === 'sidebar') {
    return (
      <div className="flex flex-col gap-8 w-full lg:w-64 shrink-0 pr-0 lg:pr-6">
        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0F4C5C] focus:ring-1 focus:ring-[#0F4C5C] transition-all shadow-sm"
          />
        </form>

        {/* Categories Vertical Stack */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Categories
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => updateFilters('', currentSearch)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  currentCategory === '' 
                    ? 'bg-[#EBF4FF] text-[#0055CC] font-bold' 
                    : 'text-gray-700 hover:bg-gray-50 font-medium'
                }`}
              >
                All
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => updateFilters(cat, currentSearch)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                    currentCategory === cat 
                      ? 'bg-[#EBF4FF] text-[#0055CC] font-bold' 
                      : 'text-gray-700 hover:bg-gray-50 font-medium'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // --- RENDERING LAYOUT 2: TABS (For the Minimalist Home Page grid) ---
  return (
    <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mb-12">
      <button
        onClick={() => updateFilters('', currentSearch)}
        className={`text-sm md:text-base transition-colors ${
          currentCategory === '' 
            ? 'font-bold text-gray-900' 
            : 'font-medium text-gray-500 hover:text-gray-900'
        }`}
      >
        All Product
      </button>
      
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => updateFilters(cat, currentSearch)}
          className={`text-sm md:text-base transition-colors ${
            currentCategory === cat 
              ? 'font-bold text-gray-900' 
              : 'font-medium text-gray-500 hover:text-gray-900'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}