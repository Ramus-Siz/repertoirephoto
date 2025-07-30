/* eslint-disable */

'use client';

import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import LogoutIcon from '@/components/icon-logout';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

 const handleLogout = async () => {
  const res = await fetch('/api/logout', { method: 'POST' });
  console.log('Logout response:', res);
  
  const data = await res.json();

  if (data.success) {
    router.push('/login');
  } else {
    console.error('Logout failed');
  }
};

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Administration</h1>

          <div className='flex items-center justify-end flex-1 pr-8'>
           <LogoutIcon />
          </div>
          
          
        </header>
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
