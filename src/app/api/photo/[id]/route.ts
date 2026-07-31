import { NextResponse } from 'next/server';
import { getPhotoById } from '@/lib/photos';

export const revalidate = 3600;

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const photo = await getPhotoById(parseInt(id, 10));

    if (!photo) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error('GET /api/photo/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
