 
import AgentsPage from '@/components/agents/agentsPage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';


export default async function AgentsListPage() {
 const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }
   return <AgentsPage withButton />;

}
