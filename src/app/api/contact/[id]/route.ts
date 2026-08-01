import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { deleteContactMessage } from '@/lib/contact';

type Params = Promise<{ id: string }>;

export async function DELETE(request: Request, { params }: { params: Params }) {
  const authError = requireAuth(request);
  if (authError) {
    return authError;
  }

  try {
    const { id } = await params;
    const messageId = parseInt(id, 10);

    if (Number.isNaN(messageId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    await deleteContactMessage(messageId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/contact/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
