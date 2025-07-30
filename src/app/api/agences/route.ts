import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';

export async function GET() {
  try {
    const agences = await prisma.agence.findMany({
      include: {
        province: true,
      },
      orderBy: { name: 'asc' }
    });


    // On retourne aussi le nom de la province avec chaque agence
    const data = agences.map((a: any) => ({
      id: a.id,
      name: a.name,
      codeAgence: a.codeAgence,
      province: {
        id: a.province.id,
        name: a.province.name,
      },
      agents: a.agents,
      orderBy: { createdAt: 'asc' }
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth();
    const body = await req.json();
    console.log('Received data for new agence:', body);

    const existingAgence = await prisma.agence.findUnique({
      where: { codeAgence: body.code },
    });

    if (existingAgence) {
      return NextResponse.json(
        { error: 'Le code agence existe déjà.' },
        { status: 400 }
      );
    }

    const newAgence = await prisma.agence.create({
      data: {
        name: body.name,
        codeAgence: body.code,
        provinceId: body.provinceId,
      },
      include: {
        province: true,
      },
    });

    return NextResponse.json({
      ...newAgence,
      provinceName: newAgence.province.name,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


export async function PUT(req: Request) {
  try {
    await requireAuth();
    const body = await req.json();

    // Mise à jour de l'agence
    const updatedAgence = await prisma.agence.update({
      where: { id: body.id },
      data: {
        name: body.name,
        codeAgence: body.code,
        provinceId: body.provinceId,
      },
    });

    return NextResponse.json(updatedAgence);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Not found or internal server error' }, { status: 404 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAuth();
    const { id } = await req.json();

    await prisma.agence.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Not found or internal server error' }, { status: 404 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAuth();

    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ error: 'Missing id or name' }, { status: 400 });
    }

    const updated = await prisma.agence.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
