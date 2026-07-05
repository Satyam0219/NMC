import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';

export const dynamic = 'force-dynamic';

export default async function ProductDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await params and cookies for Next.js 15
  const { id } = await params;
  const cookieStore = await cookies();

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

  // Fetch the single product matching the ID
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  // If the product doesn't exist or ID is invalid, show a 404 page
  if (error || !product) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-900 transition">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/?category=${product.category}`} className="hover:text-gray-900 transition">{product.category}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Left: Product Image */}
        <div className="aspect-square bg-gray-100 rounded-[2.5rem] overflow-hidden border border-gray-100 relative">
          <img 
            src={product.image_url || 'https://via.placeholder.com/800'} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.stock < 5 && product.stock > 0 && (
            <div className="absolute top-6 right-6 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold">
              Only {product.stock} left
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
              {product.brand || product.category}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            {product.name}
          </h1>
          
          <div className="text-3xl font-bold text-gray-900 mb-6">
            ₹{product.price.toLocaleString()}
          </div>

          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          <hr className="border-gray-200 mb-8" />

          {/* Client Component: Interactive Add to Cart */}
          <AddToCartButton product={product} />

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 text-gray-600">
              <Truck className="w-5 h-5 text-[#0F4C5C]" />
              <span className="text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <ShieldCheck className="w-5 h-5 text-[#0F4C5C]" />
              <span className="text-sm font-medium">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <RefreshCw className="w-5 h-5 text-[#0F4C5C]" />
              <span className="text-sm font-medium">7-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}