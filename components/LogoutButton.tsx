'use client';

import { createClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error logging out');
    } else {
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors w-full sm:w-auto justify-center"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  );
}