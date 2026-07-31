import { prisma } from './db';
import { Format } from '@/types/gallery';

export async function getAllPhotos() {
  return prisma.photo.findMany({
    orderBy: { id: 'desc' }
  });
}

export async function getPhotoById(id: number) {
  return prisma.photo.findUnique({
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
  return prisma.photo.create({ data });
}
