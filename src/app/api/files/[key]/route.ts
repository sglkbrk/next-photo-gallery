import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { readFile, getContentType } from '@/lib/file-storage';

type Params = Promise<{ key: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  try {
    const { key } = await params;
    const buffer = await readFile(key);
    const contentType = getContentType(key);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=2592000',
        Expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()
      }
    });
  } catch {
    const fallbackPath = path.join(process.cwd(), 'public', 'screenshot.png');
    const fallbackBuffer = await fs.readFile(fallbackPath);

    return new NextResponse(fallbackBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=2592000',
        Expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()
      }
    });
  }
}
