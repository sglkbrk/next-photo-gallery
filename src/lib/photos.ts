import { prisma } from './db';
import { Format } from '@/types/gallery';

function mapProjectToPhoto(project: {
  id: number;
  title: string;
  description: string;
  city: string;
  photographer: string;
  camera: string | null;
  category: number;
  mainImageUrl: string | null;
  createdAt: Date | string;
}) {
  return {
    id: project.id,
    projectsId: project.id,
    photoUrl: project.mainImageUrl,
    title: project.title,
    subtitle: '',
    description: project.description,
    location: project.city,
    city: project.city,
    photographer: project.photographer,
    category: project.category,
    size: 0,
    format: Format.horizontal,
    width: 1200,
    height: 800,
    camera: project.camera,
    lens: null,
    focalLength: null,
    aperture: null,
    iso: null,
    shutterSpeed: null,
    date: project.createdAt instanceof Date ? project.createdAt.toISOString() : String(project.createdAt)
  };
}

export async function getAllPhotos() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: { id: 'desc' },
      take: 50
    });

    if (photos.length > 0) {
      return photos;
    }

    const projects = await prisma.projects.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        description: true,
        city: true,
        photographer: true,
        camera: true,
        category: true,
        mainImageUrl: true,
        createdAt: true
      }
    });

    return projects.map(mapProjectToPhoto);
  } catch (error) {
    console.error('getAllPhotos failed:', error);
    return [];
  }
}

export async function getPhotoById(id: number) {
  return prisma.photo.findUnique({
    where: { id }
  });
}

export async function getPhotosByProjectId(projectsId: number) {
  return prisma.photo.findMany({
    where: { projectsId }
  });
}

function normalizeExifFields<T extends Record<string, unknown>>(data: T): T {
  const exifKeys = ['camera', 'lens', 'focalLength', 'aperture', 'iso', 'shutterSpeed', 'date'] as const;
  const normalized = { ...data };

  for (const key of exifKeys) {
    if (key in normalized && normalized[key] == null) {
      (normalized as Record<string, unknown>)[key] = '';
    }
  }

  return normalized;
}

export async function updatePhoto(
  id: number,
  data: Partial<{
    projectsId: number;
    photoUrl: string;
    title: string;
    subtitle: string;
    description: string;
    location: string;
    city: string;
    photographer: string;
    category: number;
    size: number;
    format: Format;
    width: number;
    height: number;
    camera: string | null;
    lens: string | null;
    focalLength: string | null;
    aperture: string | null;
    iso: string | null;
    shutterSpeed: string | null;
    date: string | null;
  }>
) {
  return prisma.photo.update({
    where: { id },
    data: normalizeExifFields(data)
  });
}

export async function deletePhoto(id: number) {
  await prisma.photo.delete({
    where: { id }
  });
}

export async function createPhoto(data: {
  projectsId: number;
  photoUrl: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  city: string;
  photographer: string;
  category: number;
  size: number;
  format: Format;
  width: number;
  height: number;
  camera?: string | null;
  lens?: string | null;
  focalLength?: string | null;
  aperture?: string | null;
  iso?: string | null;
  shutterSpeed?: string | null;
  date?: string | null;
}) {
  return prisma.photo.create({ data: normalizeExifFields(data) });
}
