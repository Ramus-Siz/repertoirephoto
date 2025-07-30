import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';

export async function GET() {
  try {
    const provinces = await prisma.province.findMany({
      include: {
        agences: true,
      },
       orderBy: { createdAt: 'asc' }
    });

    const data = provinces.map((p:any) => ({
      id: p.id,
      name: p.name,
      agencesCount: p.agences.length,
      
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
    const newProvince = await prisma.province.create({
      data: {
        name: body.name,
      },
    });
    return NextResponse.json(newProvince);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAuth();
    const body = await req.json();
    const updatedProvince = await prisma.province.update({
      where: { id: body.id },
      data: { name: body.name },
    });
    return NextResponse.json(updatedProvince);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Not found or internal server error' }, { status: 404 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAuth();
    const { id } = await req.json();
    await prisma.province.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Not found or internal server error' }, { status: 404 });
  }
}
