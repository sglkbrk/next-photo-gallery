import { prisma } from './db';
import { Format, Status } from '@/types/gallery';

const ACTIVE_PROJECT_FILTER = { status: Status.Active };

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

export async function getActiveProjects() {
  const projects = await prisma.projects.findMany({
    where: ACTIVE_PROJECT_FILTER,
    orderBy: { createdAt: 'desc' }
  });
  return projects.map(serializeProject);
}

export async function getProjectBySlug(slug: string) {
  const project = await prisma.projects.findFirst({
    where: { slug, ...ACTIVE_PROJECT_FILTER }
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
    where: { slug, ...ACTIVE_PROJECT_FILTER }
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
    where: ACTIVE_PROJECT_FILTER,
    orderBy: { createdAt: 'desc' },
    take: count
  });
  return projects.map(serializeProject);
}

export async function getHomeProjects(count: number) {
  try {
    const projects = await prisma.projects.findMany({
      where: { homePage: true, ...ACTIVE_PROJECT_FILTER },
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
    where: ACTIVE_PROJECT_FILTER,
    orderBy: { createdAt: 'desc' },
    select: { slug: true }
  });
  return projects.map((p: { slug: string }) => p.slug);
}

export async function getProjectById(id: number) {
  const project = await prisma.projects.findUnique({
    where: { id }
  });

  return project ? serializeProject(project) : null;
}

async function findProjectRecord(slugOrId: string) {
  const numericId = parseInt(slugOrId, 10);
  if (!Number.isNaN(numericId) && String(numericId) === slugOrId) {
    return prisma.projects.findUnique({ where: { id: numericId } });
  }

  return prisma.projects.findFirst({ where: { slug: slugOrId } });
}

export async function updateProject(
  id: number,
  data: {
    title: string;
    description: string;
    city: string;
    client: string;
    photographer: string;
    camera: string;
    category: number;
    mainImageUrl?: string;
    slug: string;
    status: number;
    homePage: boolean;
  }
) {
  const project = await prisma.projects.update({
    where: { id },
    data
  });
  return serializeProject(project);
}

export async function deleteProject(id: number) {
  await prisma.projects.delete({
    where: { id }
  });
}

export { findProjectRecord };

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
