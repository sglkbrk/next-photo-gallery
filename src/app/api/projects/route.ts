import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/projects';

export const revalidate = 3600;

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
