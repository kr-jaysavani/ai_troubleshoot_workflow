
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const workflows = await prisma.workflow.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { nodes: true },
        },
      },
    });
    return NextResponse.json(workflows);
  } catch (error) {
    console.error('Failed to fetch workflows:', error);
    return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    const workflow = await prisma.workflow.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(workflow);
  } catch (error) {
    console.error('Failed to create workflow:', error);
    return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 });
  }
}
