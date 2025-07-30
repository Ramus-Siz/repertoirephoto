 
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import ProvincesClient from '@/components/provinces/provincePage';

export default async function ProvincesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  return <ProvincesClient />;
}
