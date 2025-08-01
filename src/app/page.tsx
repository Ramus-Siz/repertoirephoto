 
"use client";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import { redirect } from "next/navigation";
export default async function home() {
  
   const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (!session) {
    redirect("/login");
  }

  redirect("/admin/dashboard");
  
}