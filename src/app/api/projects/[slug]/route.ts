import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';
import { requireAuth } from '@/lib/auth';
import { saveImageFile, getFileUrl, deleteImageFile } from '@/lib/file-storage';
import { deletePhoto, getPhotosByProjectId } from '@/lib/photos';
import { findProjectRecord, getProjectBySlug, updateProject, deleteProject as removeProject } from '@/lib/projects';

export const revalidate = 86400;

type Params = Promise<{ slug: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  try {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('GET /api/projects/[slug] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const authError = requireAuth(request);
  if (authError) {
    return authError;
  }

  try {
    const { slug: slugOrId } = await params;
    const existing = await findProjectRecord(slugOrId);

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const title = String(formData.get('title') ?? existing.title);
    const slugInput = String(formData.get('slug') ?? '');
    const slug =
      slugInput ||
      slugify(title, {
        lower: true,
        strict: true,
        trim: true
      });

    let mainImageUrl = existing.mainImageUrl;
    const file = formData.get('file');

    if (file instanceof File && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { fileName } = await saveImageFile(buffer, file.name);
      await deleteImageFile(existing.mainImageUrl);
      mainImageUrl = getFileUrl(fileName);
    }

    const project = await updateProject(existing.id, {
      title,
      description: String(formData.get('description') ?? existing.description),
      city: String(formData.get('city') ?? existing.city),
      client: String(formData.get('client') ?? existing.client),
      photographer: String(formData.get('photographer') ?? existing.photographer),
      camera: String(formData.get('camera') ?? existing.camera),
      category: parseInt(String(formData.get('category') ?? existing.category), 10),
      mainImageUrl: mainImageUrl ?? undefined,
      slug: slug.slice(0, 40),
      status: parseInt(String(formData.get('status') ?? existing.status), 10),
      homePage: formData.get('homePage') === 'true' || formData.get('homePage') === 'on'
    });

    revalidatePath('/');
    revalidatePath('/post');
    revalidatePath(`/${existing.slug}`);
    if (project.slug !== existing.slug) {
      revalidatePath(`/${project.slug}`);
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('PUT /api/projects/[slug] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const authError = requireAuth(request);
  if (authError) {
    return authError;
  }

  try {
    const { slug: slugOrId } = await params;
    const existing = await findProjectRecord(slugOrId);

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const photos = await getPhotosByProjectId(existing.id);
    for (const photo of photos) {
      await deleteImageFile(photo.photoUrl);
      await deletePhoto(photo.id);
    }

    await deleteImageFile(existing.mainImageUrl);
    await removeProject(existing.id);

    revalidatePath('/');
    revalidatePath('/post');
    revalidatePath('/gallery');
    revalidatePath(`/${existing.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/projects/[slug] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
