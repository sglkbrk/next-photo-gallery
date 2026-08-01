import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getTypeValues, addTypeValue } from '@/lib/admin-types';

export async function GET(request: Request) {
  const authError = requireAuth(request);
  if (authError) {
    return authError;
  }

  const { searchParams } = new URL(request.url);
  const group = searchParams.get('group') ?? '';
  const values = await getTypeValues(group);

  return NextResponse.json({ values });
}

export async function POST(request: Request) {
  const authError = requireAuth(request);
  if (authError) {
    return authError;
  }

  try {
    const body = await request.json();
    const group = String(body.group ?? '');
    const value = String(body.value ?? '');

    const values = await addTypeValue(group, value);
    return NextResponse.json({ values });
  } catch (error) {
    console.error('POST /api/admin/types error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
