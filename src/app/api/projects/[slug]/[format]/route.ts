import { NextResponse } from 'next/server';
import { getProjectPhotosByFormat } from '@/lib/projects';
import { Format } from '@/types/gallery';

export const revalidate = 86400;

type Params = Promise<{ slug: string; format: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  try {
    const { slug, format } = await params;
    const formatValue = parseInt(format, 10) as Format;

    if (formatValue !== Format.horizontal && formatValue !== Format.vertical) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    const project = await getProjectPhotosByFormat(slug, formatValue);

    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('GET /api/projects/[slug]/[format] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
