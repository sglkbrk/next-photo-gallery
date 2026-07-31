import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { saveImageFile, getFileUrl } from '@/lib/file-storage';
import { getImageDimensions } from '@/lib/image-processor';
import { readExifData } from '@/lib/exif-reader';
import { createPhoto } from '@/lib/photos';
import { Format } from '@/types/gallery';

export async function POST(request: Request) {
  const authError = requireAuth(request);
  if (authError) {
    return authError;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Fotoğraf yüklenemedi.' }, { status: 400 });
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());
    const { fileName, processedBuffer } = await saveImageFile(rawBuffer, file.name);
    const photoUrl = getFileUrl(fileName);

    const exif = await readExifData(processedBuffer);
    const { width, height } = await getImageDimensions(processedBuffer);
    const projectsId = parseInt(String(formData.get('projectsId') ?? '0'), 10);

    const photo = await createPhoto({
      projectsId,
      photoUrl,
      title: String(formData.get('title') ?? ''),
      subtitle: String(formData.get('subtitle') ?? ''),
      description: String(formData.get('description') ?? ''),
      location: String(formData.get('location') ?? ''),
      city: String(formData.get('city') ?? ''),
      photographer: String(formData.get('photographer') ?? ''),
      category: parseInt(String(formData.get('category') ?? '0'), 10),
      size: processedBuffer.length,
      format: width > height ? Format.horizontal : Format.vertical,
      width,
      height,
      camera: exif.camera,
      lens: exif.lens,
      focalLength: exif.focalLength,
      aperture: exif.aperture,
      iso: exif.iso,
      shutterSpeed: exif.shutterSpeed,
      date: exif.date
    });

    revalidatePath('/gallery');
    revalidatePath('/post');

    return NextResponse.json(photo);
  } catch (error) {
    console.error('POST /api/photo/upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
