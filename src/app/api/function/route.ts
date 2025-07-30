import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';

export async function GET() {
  try {
    const functions = await prisma.function.findMany(
      {
      orderBy: { createdAt: 'asc' }

      }
    );
    return NextResponse.json(functions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// export async function POST(req: Request) {
//   try {
//     await requireAuth();
//     const body = await req.json();
//     const newFunction = await prisma.function.create({
//       data: {
//         name: body.name,
//       },
//     });
//     return NextResponse.json(newFunction);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

export async function POST(req: Request) {
  try {
    await requireAuth();
    const body = await req.json();
    //verifie d'abord si le nom de la fonction existe déjà 
    const existingFunction = await prisma.function.findFirst({
      where: { name: body.name },
    });

    if (existingFunction) {
      return NextResponse.json({ error: 'La fonction existe déjà' }, { status: 409 });
    }
    // Si la fonction n'existe pas, on la crée
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json({ error: 'Nom de fonction invalide' }, { status: 400 });
    }

    const newFunction = await prisma.function.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json({
      id: newFunction.id,
      name: newFunction.name,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAuth();
    const body = await req.json();
    const updatedFunction = await prisma.function.update({
      where: { id: body.id },
      data: { name: body.name },
    });
    return NextResponse.json(updatedFunction);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Not found or internal server error' }, { status: 404 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAuth();
    const { id } = await req.json();
    await prisma.function.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Not found or internal server error' }, { status: 404 });
  }
}
