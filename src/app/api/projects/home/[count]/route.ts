import { NextResponse } from 'next/server';
import { getHomeProjects } from '@/lib/projects';

export const revalidate = 3600;

type Params = Promise<{ count: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  try {
    const { count } = await params;
    const projects = await getHomeProjects(parseInt(count, 10));
    return NextResponse.json(projects);
  } catch (error) {
    console.error('GET /api/projects/home error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
