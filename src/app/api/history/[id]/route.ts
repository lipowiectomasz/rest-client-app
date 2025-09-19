import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new Response('Unauthorized', { status: 401 });
    }

    const historyId = params.id;
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
