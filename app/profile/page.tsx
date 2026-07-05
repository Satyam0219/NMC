import LogoutButton from '@/components/LogoutButton'
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Package, User, LogOut } from 'lucide-react';
import Link from 'next/link';

// 1. FORCE DYNAMIC: This stops Next.js from caching the page so new orders appear instantly!
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  // 2. Get the currently logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  // If they aren't logged in, send them to the login page
  if (!user) {
    redirect('/login'); 
  }

  // 3. Fetch ONLY this specific customer's orders by matching their email
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('email', user.email)
    .order('created_at', { ascending: false });

  // 4. INTELLIGENT NAME EXTRACTION
  // Try to get their name from their Google/Supabase Auth profile first...
  let customerName = user.user_metadata?.full_name || user.user_metadata?.name;
  
  // If they don't have a name in Auth, grab the First and Last name they used on their most recent order!
  if (!customerName && orders && orders.length > 0) {
    customerName = `${orders[0].first_name} ${orders[0].last_name}`;
  }
  
  // Final fallback just in case they have literally no data
  const displayName = customerName || 'Valued Customer';

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, {displayName}!
          </h1>
          <p className="text-gray-500 mt-1">Manage your account and view your order history.</p>
        </div>
        
        {/* Simple Logout Button */}
        {/* Simple Logout Button */}
        <LogoutButton />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Account Details Box */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Account Details</h2>
            <div className="space-y-4 mt-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Orders</p>
                <p className="text-sm font-medium text-gray-900">{orders?.length || 0} lifetime orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
          
          <div className="space-y-6">
            {!orders || orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <Package className="w-16 h-16 text-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">You haven't placed any orders with us yet.</p>
                <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition hover:shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order Placed</p>
                      <p className="text-sm font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 text-left sm:text-center">Total Amount</p>
                      <p className="text-sm font-bold text-gray-900">₹{order.total_amount?.toLocaleString()}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order #</p>
                      <p className="text-sm font-medium text-gray-500">{order.id.split('-')[0].toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Via {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                      </span>
                    </div>
                    
                    {/* Placeholder for order details view */}
                    <button className="text-[#0F4C5C] text-sm font-bold hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}