import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Search, MessageSquare } from 'lucide-react';
import AdminTabs from '@/components/AdminTabs';
import MessageRow from '@/components/MessageRow'; 

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <AdminTabs />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customer Messages</h1>
          <p className="text-gray-500 mt-1">Manage support inquiries and wholesale requests.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search email or subject..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Removed overflow-x-auto so it physically cannot scroll horizontally */}
        <div className="max-h-[600px] overflow-y-auto relative">
          
          {/* Added table-fixed to force the table to obey our strict column percentages */}
          <table className="w-full text-left text-sm table-fixed">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100 uppercase tracking-wider text-xs sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 w-[15%]">Date</th>
                <th className="px-6 py-4 w-[25%]">Customer</th>
                <th className="px-6 py-4 w-[20%]">Subject</th>
                <th className="px-6 py-4 w-[25%]">Message Preview</th>
                <th className="px-6 py-4 w-[15%]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              {!messages || messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <MessageSquare className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-base font-medium text-gray-900">Inbox Zero</p>
                      <p className="text-sm">You have no new messages at this time.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <MessageRow key={msg.id} msg={msg} />
                ))
              )}
              
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}