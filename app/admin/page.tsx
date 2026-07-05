import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AdminTabs from '@/components/AdminTabs';
import DashboardChart from '@/components/DashboardChart';
import { TrendingUp, Package, DollarSign, ArrowUpRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  // 1. Total Orders placed (Keep this as all orders so you know volume)
  const totalOrders = orders?.length || 0;
  
  // 2. TRUE REVENUE: Only add the amount if the status is strictly 'delivered'
  const totalRevenue = orders?.reduce((sum, order) => {
    if (order.status?.toLowerCase() === 'delivered') {
      return sum + (Number(order.total_amount) || 0);
    }
    return sum; // If it is returned, pending, or processing, it adds $0
  }, 0) || 0;

  // 3. TRUE AVERAGE: Only calculate the average against successfully delivered orders
  const deliveredOrdersCount = orders?.filter(o => o.status?.toLowerCase() === 'delivered').length || 0;
  const avgOrderValue = deliveredOrdersCount > 0 ? totalRevenue / deliveredOrdersCount : 0;

  // 4. CHART DATA: Only plot delivered revenue on the graph
  const monthlyData: { [key: string]: number } = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIndex = new Date().getMonth();
  
  for (let i = 5; i >= 0; i--) {
    let index = currentMonthIndex - i;
    if (index < 0) index += 12;
    monthlyData[months[index]] = 0;
  }

  orders?.forEach(order => {
    // Only map this order to the chart if it was delivered!
    if (order.status?.toLowerCase() === 'delivered') {
      const date = new Date(order.created_at);
      const monthName = months[date.getMonth()];
      if (monthlyData[monthName] !== undefined) {
        monthlyData[monthName] += Number(order.total_amount) || 0;
      }
    }
  });

  const chartData = Object.keys(monthlyData).map(month => ({
    month,
    revenue: monthlyData[month]
  }));

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#FAFAFA] min-h-screen">
      
      <AdminTabs />
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-gray-500 mt-1">Here is what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Real Revenue Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-full">
            <TrendingUp className="w-4 h-4 mr-1" /> +12.5% 
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Quantity</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">{totalOrders.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-full">
            <TrendingUp className="w-4 h-4 mr-1" /> +4.2% 
          </div>
        </div>

        {/* Real AOV Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg. Order Value</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">₹{avgOrderValue.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-full">
            <TrendingUp className="w-4 h-4 mr-1" /> +1.1% 
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">Sales Analytics (Completed)</h2>
        </div>
        <DashboardChart data={chartData} />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Invoices</h2>
          <Link href="/admin/orders" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-400 font-bold border-b border-gray-100 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Order Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No recent orders found.</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-500">
                      #{order.id.split('-')[0].toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">
                          {order.first_name[0]}{order.last_name[0]}
                        </div>
                        <span className="font-bold text-gray-900">{order.first_name} {order.last_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {new Date(order.created_at).toLocaleDateString('en-GB')}
                    </td>
                    
                    {/* NEW: Robust Status Badges! */}
                    <td className="px-6 py-4">
                      {order.status?.toLowerCase() === 'delivered' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                        </span>
                      ) : order.status?.toLowerCase() === 'returned' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700">
                          <XCircle className="w-3.5 h-3.5" /> Returned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                          <Clock className="w-3.5 h-3.5" /> {order.status || 'Pending'}
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ₹{order.total_amount?.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}