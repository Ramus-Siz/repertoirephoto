import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Supprimer le cookie 'token' en le rendant expiré immédiatement
  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',           // doit correspondre au path du cookie lors de la création
    expires: new Date(0), // date passée pour suppression immédiate
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
