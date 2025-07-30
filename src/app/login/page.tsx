/* eslint-disable */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {toast} from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);  


  const handleLogin = async () => {
    try {
      setLoading(true);
     const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.ok) {
      toast.success('Connexion réussie');
      router.push('/admin/dashboard');
      } else {
        setError('Identifiants invalides');
        toast.error('Connexion échouée');
      }

    } catch (error) {
      setError('Identifiants invalides');
      toast.error('Connexion échouée');
    }finally{
      setLoading(false);
    }
   
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-sm shadow-lg border-0 z-50">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">Connexion Admin</h1>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <Button onClick={handleLogin} className="w-full" disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </CardContent>
      </Card>
      <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
      <img src="/Advans_Congo_Logo.svg" alt=""  className='opacity-50'/>
      </div>
    </div>
  );
}
