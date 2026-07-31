import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAllContactMessages, createContactMessage } from '@/lib/contact';

export async function GET(request: Request) {
  const authError = requireAuth(request);
  if (authError) {
    return authError;
  }

  try {
    const messages = await getAllContactMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('GET /api/contact error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.email || !body.message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    await createContactMessage({
      name: String(body.name ?? ''),
      email: String(body.email),
      subject: String(body.subject ?? ''),
      message: String(body.message)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
