
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  // Utiliser un dossier uploads séparé du dossier public
  const uploadDir = path.join(process.cwd(), 'uploads');

  await mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  // Retourner l'URL vers notre API de service d'images
  return NextResponse.json({ url: `/api/images/${fileName}` });
}
