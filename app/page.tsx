import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import StoreFilters from '@/components/StoreFilters';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await cookies and params for Next.js 15 compatibility
  const cookieStore = await cookies();
  const params = await searchParams;
  
  const category = typeof params.category === 'string' ? params.category : '';
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  // 1. Fetch unique categories for the tabs
  const { data: allProducts } = await supabase.from('products').select('category');
  const uniqueCategories = Array.from(new Set(allProducts?.map(p => p.category) || []));

  // 2. Build the database query dynamically based on URL filters
  let dbQuery = supabase.from('products').select('*');
  if (category) dbQuery = dbQuery.eq('category', category);
  
  const { data: products, error } = await dbQuery.order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-semibold">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      
      {/* HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 min-h-[60vh]">
        <div className="max-w-xl">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
            Precision Hygiene Meets Everyday Warmth.
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Clinical-grade sanitizers and skincare designed to keep you and your loved ones safe without compromising on care.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              href="#shop" 
              className="px-8 py-4 bg-[#0F4C5C] text-white rounded-full font-medium hover:bg-[#0a3642] transition-colors"
            >
              Shop Now
            </Link>
            <Link 
              href="/about" 
              className="px-8 py-4 bg-transparent text-gray-900 border border-gray-200 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>

        <div className="relative w-full aspect-square md:aspect-4/3 bg-gray-200 rounded-[2.5rem] overflow-hidden flex items-center justify-center shadow-sm">
          <div className="text-center p-8">
            <p className="text-gray-500 font-medium">NMC Product Showcase</p>
            <p className="text-sm text-gray-400 mt-2">(Replace with actual image)</p>
          </div>
        </div>
      </div>

      {/* SHOP SECTION */}
      <div id="shop" className="pt-24 pb-32 scroll-mt-20 border-t border-gray-100">
        
        {/* Centered Headings matching the screenshot */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-4">
            Products
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Our Products
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Clinical-grade essentials for a safer, cleaner home.
          </p>
        </div>

        {/* Tabs Component */}
        <Suspense fallback={<div className="h-10 w-full mb-12"></div>}>
          <StoreFilters categories={uniqueCategories} />
        </Suspense>

        {/* PRODUCT GRID */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16 mt-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-3xl border border-gray-100 mt-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your category filters.</p>
          </div>
        )}

      </div>
    </main>
  );
}