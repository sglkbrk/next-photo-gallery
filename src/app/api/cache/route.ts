import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  const authError = requireAuth(request);
  if (authError) {
    return authError;
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      revalidatePath(`/${slug}`);
      revalidatePath(`/photosh/${slug}`);
      revalidatePath(`/photos/${slug}`);
    } else {
      revalidatePath('/');
      revalidatePath('/post');
      revalidatePath('/gallery');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('GET /api/cache error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
