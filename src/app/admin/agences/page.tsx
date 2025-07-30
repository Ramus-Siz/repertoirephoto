 

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AgencesClient from '@/components/agences/agencesPage';

export default async function AgencesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  return <AgencesClient />;
}
