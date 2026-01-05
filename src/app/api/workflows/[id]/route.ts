
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: {
        nodes: true,
        edges: true,
      },
    });

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    return NextResponse.json(workflow);
  } catch (error) {
    console.error('Failed to fetch workflow:', error);
    return NextResponse.json({ error: 'Failed to fetch workflow' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, nodes, edges } = body;

    // Transaction to update workflow and replace nodes/edges
    const updatedWorkflow = await prisma.$transaction(async (tx) => {
      // Update metadata
      await tx.workflow.update({
        where: { id },
        data: { name, description },
      });

      // Simple strategy: Delete all and recreate (easiest for syncing graph)
      // Optimized strategy would be diffing, but for prototype recreate is fine.
      if (nodes && edges) {
        await tx.edge.deleteMany({ where: { workflowId: id } });
        await tx.node.deleteMany({ where: { workflowId: id } });

        if (nodes.length > 0) {
            await tx.node.createMany({
                data: nodes.map((node: any) => ({
                    id: node.id,
                    type: node.type,
                    positionX: node.positionX || node.position?.x || 0,
                    positionY: node.positionY || node.position?.y || 0,
                    config: node.config || {},
                    workflowId: id,
                })),
            });
        }

        if (edges.length > 0) {
            await tx.edge.createMany({
                data: edges.map((edge: any) => ({
                    id: edge.id,
                    sourceId: edge.source,
                    targetId: edge.target,
                    workflowId: id,
                })),
            });
        }
      }

      return tx.workflow.findUnique({
        where: { id },
        include: { nodes: true, edges: true },
      });
    });

    return NextResponse.json(updatedWorkflow);
  } catch (error) {
    console.error('Failed to update workflow:', error);
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.workflow.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete workflow:', error);
    return NextResponse.json({ error: 'Failed to delete workflow' }, { status: 500 });
  }
}
