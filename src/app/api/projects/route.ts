import { NextResponse } from 'next/server';
import { verifyBasicAuth } from '@/lib/auth';
import { getActiveProjects, getAllProjects } from '@/lib/projects';

export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const includeAll = url.searchParams.get('all') === '1' || url.searchParams.get('all') === 'true';
    const projects = includeAll && verifyBasicAuth(request) ? await getAllProjects() : await getActiveProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
