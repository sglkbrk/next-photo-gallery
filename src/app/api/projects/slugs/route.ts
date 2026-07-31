import { NextResponse } from 'next/server';
import { getAllSlugs } from '@/lib/projects';

export const revalidate = 3600;

export async function GET() {
  try {
    const slugs = await getAllSlugs();
    return NextResponse.json(slugs);
  } catch (error) {
    console.error('GET /api/projects/slugs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
