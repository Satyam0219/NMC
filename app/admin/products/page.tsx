import AdminTabs from '@/components/AdminTabs';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Edit, Plus } from 'lucide-react';
import DeleteProductButton from './DeleteProductButton'; // We will create this next

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });

return (
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

    {/* NEW TABS COMPONENT */}
    <AdminTabs />

    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Manage Products</h1>
      {/* Your Add New Product button... */}
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 bg-[#0F4C5C] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#0a3642] transition"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600 text-sm">Product</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Price</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Stock</th>
              <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-4 flex items-center gap-4">
                  <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded object-cover border" />
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                </td>
                <td className="p-4 font-medium text-gray-900">₹{product.price}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock} in stock
                  </span>
                </td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <Edit className="w-5 h-5" />
                  </Link>
                  <DeleteProductButton id={product.id} name={product.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}