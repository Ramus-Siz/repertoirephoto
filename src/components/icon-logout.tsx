 
"use client";
import { Loader2, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';


export default function LogoutIcon() {
const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ callbackUrl: '/login' });
    toast.success('Vous avez bien quité votre session');
  };
  return (
    <div
    className="w-6 h-6 cursor-pointer text-gray-700 hover:text-red-600 "
      onClick={handleLogout}
      role="button"
      aria-label="Se déconnecter"
    
    >
    {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#008237]" />
      ) : (
        <LogOut className="w-6 h-6 cursor-pointer text-gray-700 hover:text-red-600" />
      )}

    </div>
    
  );
}
