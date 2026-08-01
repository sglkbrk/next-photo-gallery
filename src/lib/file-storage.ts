import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { compressAndWatermark } from './image-processor';

function getUploadsDir(): string {
  return process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
}

export async function ensureUploadsDir(): Promise<string> {
  const uploadsDir = getUploadsDir();
  await fs.mkdir(uploadsDir, { recursive: true });
  return uploadsDir;
}

export async function saveImageFile(
  buffer: Buffer,
  originalName: string
): Promise<{ fileName: string; processedBuffer: Buffer }> {
  const uploadsDir = await ensureUploadsDir();
  const ext = path.extname(originalName).toLowerCase() || '.jpg';
  const fileName = `${randomUUID()}${ext}`;
  const filePath = path.join(uploadsDir, fileName);

  const processed = await compressAndWatermark(buffer);
  await fs.writeFile(filePath, processed);

  return { fileName, processedBuffer: processed };
}

export async function readFile(fileName: string): Promise<Buffer> {
  const uploadsDir = path.resolve(getUploadsDir());
  const safeName = path.basename(fileName);
  const filePath = path.resolve(uploadsDir, safeName);

  if (!filePath.startsWith(uploadsDir)) {
    throw new Error('Invalid file path');
  }

  return fs.readFile(filePath);
}

export function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

export function getFileUrl(fileName: string): string {
  return fileName;
}

export async function deleteImageFile(fileName: string | null | undefined): Promise<void> {
  if (!fileName) {
    return;
  }

  const uploadsDir = path.resolve(getUploadsDir());
  const safeName = path.basename(fileName);
  const filePath = path.resolve(uploadsDir, safeName);

  if (!filePath.startsWith(uploadsDir)) {
    throw new Error('Invalid file path');
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}
