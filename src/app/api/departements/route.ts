import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';

export async function GET() {
  try {
    const departements = await prisma.departement.findMany(
      {
        include: {
          agents: true,
        },
       orderBy: { createdAt: 'asc' }
      }
      
        
    );
    return NextResponse.json(departements);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth();

    const data = await req.json();
    if (!data.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Check if the department already exists
    const existingDepartement = await prisma.departement.findFirst({
      where: { name: data.name },
    });

    if (existingDepartement) {
      return NextResponse.json({ error: 'Le département existe déjà' }, { status: 409 });
    }

    const created = await prisma.departement.create({
      data: { name: data.name },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAuth();

    const data = await req.json();
    if (!data.id || !data.name) {
      return NextResponse.json({ error: 'Missing id or name' }, { status: 400 });
    }

    const updated = await prisma.departement.update({
      where: { id: data.id },
      data: { name: data.name },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAuth();

    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ error: 'Missing id or name' }, { status: 400 });
    }

    const updated = await prisma.departement.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAuth();

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await prisma.departement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
