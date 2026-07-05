import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
// 1. UPDATED IMPORT: Changed from ShopFilters to StoreFilters
import StoreFilters from '@/components/StoreFilters';

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const cookieStore = await cookies();
  const params = await searchParams;
  
  const category = typeof params.category === 'string' ? params.category : '';
  const query = typeof params.q === 'string' ? params.q : '';
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  // 1. Fetch categories
  const { data: allProducts } = await supabase.from('products').select('category');
  const uniqueCategories = Array.from(new Set(allProducts?.map(p => p.category) || []));

  // 2. Build the query dynamically
  let dbQuery = supabase.from('products').select('*');
  if (category) dbQuery = dbQuery.eq('category', category);
  if (query) dbQuery = dbQuery.ilike('name', `%${query}%`);
  
  const { data: products } = await dbQuery.order('created_at', { ascending: false });

  // Determine dynamic title based on filters
  const pageTitle = category ? category : query ? `Search Results for "${query}"` : 'All Products';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-gray-500 font-medium">
          {products?.length || 0} products &bull; Free shipping over ₹499
        </p>
      </div>

      {/* Main Layout: Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar (Filters) */}
        <Suspense fallback={<div className="w-64 h-96 bg-gray-50 rounded-xl animate-pulse"></div>}>
          {/* 2. UPDATED COMPONENT: Using StoreFilters with layout="sidebar" */}
          <StoreFilters categories={uniqueCategories} layout="sidebar" />
        </Suspense>

        {/* Right Content (Product Grid) */}
        <div className="flex-1">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
        
      </div>
    </main>
  );
}
