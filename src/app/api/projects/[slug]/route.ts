import { NextResponse } from 'next/server';
import { getProjectBySlug } from '@/lib/projects';

export const revalidate = 86400;

type Params = Promise<{ slug: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  try {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('GET /api/projects/[slug] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
