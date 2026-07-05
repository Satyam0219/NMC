import OrderStatusDropdown from '@/components/OrderStatusDropdown';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Package, Search, Eye } from 'lucide-react';
import AdminTabs from '@/components/AdminTabs';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll() { return cookieStore.getAll(); } } }
    );

    // Fetch orders from your database
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* NEW TABS COMPONENT */}
            <AdminTabs />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order Management</h1>
                    <p className="text-gray-500 mt-1">View and manage all customer orders.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search order ID or customer..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">

                            {!orders || orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <Package className="w-12 h-12 mb-3 text-gray-300" />
                                            <p className="text-base font-medium text-gray-900">No orders yet</p>
                                            <p className="text-sm">When customers place orders, they will appear here.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{order.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">{order.email || 'Guest'}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">₹{order.total_amount?.toLocaleString() || '0'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.payment_method === 'cod' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.payment_method || 'Online'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <OrderStatusDropdown
                                                orderId={order.id}
                                                currentStatus={order.status}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-[#0F4C5C] hover:underline">
                                                <Eye className="w-4 h-4" /> View
                                            </Link>
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