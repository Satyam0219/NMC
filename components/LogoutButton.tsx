'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { signOutAction } from '@/app/actions/auth';

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOutAction();
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      onClick={handleSignOut}
      disabled={isLoggingOut}
      className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-50 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LogOut className="w-4 h-4" /> 
      {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
    </button>
  );
}