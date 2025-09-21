import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id: historyId } = await params; // Await the params
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    const historyItem = await prisma.requestHistory.findFirst({
      where: {
        id: historyId,
        userId: user.id,
      },
    });

    if (!historyItem) {
      return new Response('History item not found', { status: 404 });
    }

    return new Response(JSON.stringify(historyItem), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('History fetch error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch history' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id: historyId } = await params; // Await the params
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    // Check if the history item belongs to the user
    const historyItem = await prisma.requestHistory.findFirst({
      where: {
        id: historyId,
        userId: user.id,
      },
    });

    if (!historyItem) {
      return new Response('History item not found', { status: 404 });
    }

    // Delete the history item
    await prisma.requestHistory.delete({
      where: {
        id: historyId,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('History delete error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete history item' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
