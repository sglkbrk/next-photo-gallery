import { headers } from 'next/headers';

export async function getBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') ?? 'http';

  if (host) {
    return `${protocol}://${host}`;
  }

  return 'http://localhost:3000';
}

export async function fetchApi<T>(path: string, revalidate = 3600, fallbackValue?: T): Promise<T> {
  const baseUrl = await getBaseUrl();

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      next: { revalidate }
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${path}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`fetchApi failed for ${path}:`, error);
    return fallbackValue as T;
  }
}
