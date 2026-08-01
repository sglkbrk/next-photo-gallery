import { NextResponse } from 'next/server';
import { getAllPhotos } from '@/lib/photos';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const photos = await getAllPhotos();
    return NextResponse.json(photos);
  } catch (error) {
    console.error('GET /api/photo error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
