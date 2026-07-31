import { prisma } from './db';
import { Format } from '@/types/gallery';

function serializeProject<T extends Record<string, unknown>>(project: T) {
  return {
    ...project,
    createdAt: project.createdAt instanceof Date ? project.createdAt.toISOString() : project.createdAt
  };
}

export async function getAllProjects() {
  const projects = await prisma.projects.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return projects.map(serializeProject);
}

export async function getProjectBySlug(slug: string) {
  const project = await prisma.projects.findFirst({
    where: { slug }
  });

  if (!project) {
    return null;
  }

  const photosHorizontal = await prisma.photo.findMany({
    where: { projectsId: project.id, format: Format.horizontal },
    take: 6
  });

  const photosVertical = await prisma.photo.findMany({
    where: { projectsId: project.id, format: Format.vertical },
    take: 4
  });

  return serializeProject({
    ...project,
    photos: [...photosHorizontal, ...photosVertical]
  });
}

export async function getProjectPhotosByFormat(slug: string, format: Format) {
  const project = await prisma.projects.findFirst({
    where: { slug }
  });

  if (!project) {
    return null;
  }

  const photos = await prisma.photo.findMany({
    where: { projectsId: project.id, format }
  });

  return serializeProject({
    ...project,
    photos
  });
}

export async function getRecentProjects(count: number) {
  const projects = await prisma.projects.findMany({
    orderBy: { createdAt: 'desc' },
    take: count
  });
  return projects.map(serializeProject);
}

export async function getHomeProjects(count: number) {
  try {
    const projects = await prisma.projects.findMany({
      where: { homePage: true },
      orderBy: { createdAt: 'desc' },
      take: count
    });
    return projects.map(serializeProject);
  } catch (error) {
    console.error('getHomeProjects failed:', error);
    return [];
  }
}

export async function getAllSlugs() {
  const projects = await prisma.projects.findMany({
    orderBy: { createdAt: 'desc' },
    select: { slug: true }
  });
  return projects.map((p: { slug: string }) => p.slug);
}

export async function createProject(data: {
  title: string;
  description: string;
  city: string;
  client: string;
  photographer: string;
  camera: string;
  category: number;
  mainImageUrl: string;
  slug: string;
  status: number;
  homePage: boolean;
}) {
  const project = await prisma.projects.create({
    data: {
      ...data,
      createdAt: new Date()
    }
  });
  return serializeProject(project);
}
