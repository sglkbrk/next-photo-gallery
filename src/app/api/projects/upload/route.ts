import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';
import { requireAuth } from '@/lib/auth';
import { saveImageFile, getFileUrl } from '@/lib/file-storage';
import { createProject } from '@/lib/projects';

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

    const title = String(formData.get('title') ?? '');
    const slugInput = String(formData.get('slug') ?? '');
    const slug =
      slugInput ||
      slugify(title, {
        lower: true,
        strict: true,
        trim: true
      });

    const buffer = Buffer.from(await file.arrayBuffer());
    const { fileName, processedBuffer } = await saveImageFile(buffer, file.name);
    const photoUrl = getFileUrl(fileName);

    const project = await createProject({
      title,
      description: String(formData.get('description') ?? ''),
      city: String(formData.get('city') ?? ''),
      client: String(formData.get('client') ?? ''),
      photographer: String(formData.get('photographer') ?? ''),
      camera: String(formData.get('camera') ?? ''),
      category: parseInt(String(formData.get('category') ?? '0'), 10),
      mainImageUrl: photoUrl,
      slug: slug.slice(0, 40),
      status: parseInt(String(formData.get('status') ?? '0'), 10),
      homePage: formData.get('homePage') === 'true' || formData.get('homePage') === 'on'
    });

    revalidatePath('/');
    revalidatePath('/post');
    revalidatePath(`/${project.slug}`);

    return NextResponse.json(project);
  } catch (error) {
    console.error('POST /api/projects/upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
