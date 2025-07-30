import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const { url } = await req.json();
  if (!url) {
    return NextResponse.json({ success: false, message: 'No URL provided' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', url.replace(/^\/?/, ''));

  try {
    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
  console.error('Erreur lors de la suppression du fichier :', error);
  return NextResponse.json(
    { success: false, error: 'Fichier introuvable ou impossible à supprimer' },
    { status: 500 }
  );
}

}
