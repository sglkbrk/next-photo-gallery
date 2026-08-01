import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { saveImageFile, getFileUrl, deleteImageFile } from '@/lib/file-storage';
import { getImageDimensions } from '@/lib/image-processor';
import { readExifData } from '@/lib/exif-reader';
import { getPhotoById, updatePhoto, deletePhoto as removePhoto } from '@/lib/photos';
import { findProjectRecord } from '@/lib/projects';
import { Format } from '@/types/gallery';

export const revalidate = 3600;

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const photo = await getPhotoById(parseInt(id, 10));

    if (!photo) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error('GET /api/photo/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const authError = requireAuth(request);
  if (authError) {
    return authError;
  }

  try {
    const { id } = await params;
    const photoId = parseInt(id, 10);
    const existing = await getPhotoById(photoId);

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const projectsId = parseInt(String(formData.get('projectsId') ?? existing.projectsId), 10);
    const project = await findProjectRecord(String(projectsId));

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 400 });
    }

    const updateData: Parameters<typeof updatePhoto>[1] = {
      projectsId,
      title: String(formData.get('title') ?? existing.title),
      subtitle: String(formData.get('subtitle') ?? existing.subtitle),
      description: String(formData.get('description') ?? existing.description),
      location: String(formData.get('location') ?? existing.location),
      city: String(formData.get('city') ?? existing.city),
      photographer: String(formData.get('photographer') ?? existing.photographer),
      category: parseInt(String(formData.get('category') ?? existing.category), 10)
    };

    const file = formData.get('file');
    if (file instanceof File && file.size > 0) {
      const rawBuffer = Buffer.from(await file.arrayBuffer());
      const { fileName, processedBuffer } = await saveImageFile(rawBuffer, file.name);
      const exif = await readExifData(processedBuffer);
      const { width, height } = await getImageDimensions(processedBuffer);

      await deleteImageFile(existing.photoUrl);

      updateData.photoUrl = getFileUrl(fileName);
      updateData.size = processedBuffer.length;
      updateData.format = width > height ? Format.horizontal : Format.vertical;
      updateData.width = width;
      updateData.height = height;
      updateData.camera = exif.camera;
      updateData.lens = exif.lens;
      updateData.focalLength = exif.focalLength;
      updateData.aperture = exif.aperture;
      updateData.iso = exif.iso;
      updateData.shutterSpeed = exif.shutterSpeed;
      updateData.date = exif.date;
    }

    const photo = await updatePhoto(photoId, updateData);

    revalidatePath('/gallery');
    revalidatePath('/post');
    revalidatePath(`/${project.slug}`);

    return NextResponse.json(photo);
  } catch (error) {
    console.error('PUT /api/photo/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const authError = requireAuth(request);
  if (authError) {
    return authError;
  }

  try {
    const { id } = await params;
    const photoId = parseInt(id, 10);
    const existing = await getPhotoById(photoId);

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const project = await findProjectRecord(String(existing.projectsId));

    await deleteImageFile(existing.photoUrl);
    await removePhoto(photoId);

    revalidatePath('/gallery');
    revalidatePath('/post');
    if (project) {
      revalidatePath(`/${project.slug}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/photo/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
