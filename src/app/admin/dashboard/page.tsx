 
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import DashboardClient from '@/components/dashboard/dashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  console.log('Session:', session?.user );
  

  if (session?.user === undefined) {
    redirect('/login');
  }
  return <DashboardClient />;
}
