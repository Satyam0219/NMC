import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { IndianRupee, Package, TrendingUp, Users } from 'lucide-react';

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  
  // Initialize server-side Supabase client
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

  // Verify Admin Status (In a production app, verify role from a 'profiles' table)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch Aggregate Data for KPIs
  const [
    { count: totalOrders },
    { count: totalProducts },
    { data: ordersData }
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount').eq('status', 'paid')
  ]);

  // Calculate Total Revenue
  const totalRevenue = ordersData?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin. Here is what is happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString()}`} 
          icon={<IndianRupee className="w-6 h-6 text-emerald-600" />} 
          trend="+12% from last month"
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrders?.toString() || '0'} 
          icon={<Package className="w-6 h-6 text-blue-600" />} 
          trend="Requires processing"
        />
        <StatCard 
          title="Active Products" 
          value={totalProducts?.toString() || '0'} 
          icon={<TrendingUp className="w-6 h-6 text-indigo-600" />} 
          trend="In your catalog"
        />
        <StatCard 
          title="Customers" 
          value="View" 
          icon={<Users className="w-6 h-6 text-purple-600" />} 
          trend="Manage database"
        />
      </div>

      {/* Placeholder for Recent Orders Table */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-500">
          Order table component goes here. (Requires data table integration)
        </div>
      </div>
    </div>
  );
}

// Reusable KPI Card Component
function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="bg-white p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-2">{trend}</p>
    </div>
  );
}