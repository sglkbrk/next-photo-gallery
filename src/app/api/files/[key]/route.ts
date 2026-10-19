import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { readFile, statFile, getContentType } from '@/lib/file-storage';

type Params = Promise<{ key: string }>;

const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable';

export async function GET(request: Request, { params }: Params extends Promise<infer T> ? { params: Promise<T> } : never) {
  try {
    const { key } = await params;
    const { size, mtime, etag } = await statFile(key);

    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          'Cache-Control': IMMUTABLE_CACHE_CONTROL,
          'Last-Modified': mtime.toUTCString()
        }
      });
    }

    const buffer = await readFile(key);
    const contentType = getContentType(key, buffer);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': size.toString(),
        ETag: etag,
        'Last-Modified': mtime.toUTCString(),
        'Cache-Control': IMMUTABLE_CACHE_CONTROL
      }
    });
  } catch {
    const fallbackPath = path.join(process.cwd(), 'public', 'screenshot.png');
    const fallbackBuffer = await fs.readFile(fallbackPath);

    return new NextResponse(fallbackBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  }
}
