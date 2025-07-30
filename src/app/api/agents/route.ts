import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';

export async function GET() {
  const agents = await prisma.agent.findMany(
    {
      include: {
        agence: {
          include: { province: true },
        },
        departement: true,
        function: true,
      },
      orderBy: { createdAt: 'asc' }
    }
  );

  return NextResponse.json(agents);
}

async function findProvinceIdByAgenceId(agenceId: number) {
  const agence = await prisma.agence.findUnique({
    where: { id: agenceId },
    select: { provinceId: true },
  });

  return agence?.provinceId;
}


export async function POST(req: Request) {
  const newAgent = await req.json();

  const provinceId = await findProvinceIdByAgenceId(Number(newAgent.agenceId));

  if (!provinceId) {
    return NextResponse.json({ error: 'Province not found for the given agence id' }, { status: 404 });
  }

  newAgent.provinceId = provinceId;

   
  if (typeof newAgent.functionId === 'string' && newAgent.functionId.trim() !== '') {
     const newFunction = await prisma.function.create({
        data: {
          name: newAgent.functionId,
        },
      });
    newAgent.functionId = newFunction.id;

  } else if (typeof newAgent.functionId === 'number') {
    newAgent.functionId = Number(newAgent.functionId);
  } else {
    return NextResponse.json({ error: 'Invalid functionId' }, { status: 400 });
  }    

  const created = await prisma.agent.create({
    data: {
      firstName: newAgent.firstName,
      lastName: newAgent.lastName,
      phoneNumbers: newAgent.phoneNumbers,
      photoUrl: newAgent.photoUrl,
      agenceId: Number(newAgent.agenceId),
      provinceId: provinceId,
      departementId: Number(newAgent.departementId),
      functionId: Number(newAgent.functionId),
      engagementDate: newAgent.engagementDate,
      status: newAgent.status,
    },
  });

  return NextResponse.json(created);
}


export async function PUT(req: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updatedAgent = await req.json();
  const updated = await prisma.agent.update({
    where: { id: updatedAgent.id },
    data: {
      firstName: updatedAgent.firstName,
      lastName: updatedAgent.lastName,
      phoneNumbers: updatedAgent.phoneNumbers,
      photoUrl: updatedAgent.photoUrl,
      departementId: Number(updatedAgent.departementId),
      functionId: Number(updatedAgent.functionId),
      engagementDate: updatedAgent.engagementDate,
      status: updatedAgent.status,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();

  await prisma.agent.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, status } = await req.json();

  if (typeof id === 'undefined' || typeof status === 'undefined') {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
  }

  const updated = await prisma.agent.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}
