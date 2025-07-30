 
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import FunctionsClient from '@/components/fonctions/FunctionsClient';

export default async function FunctionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  return <FunctionsClient />;
}
