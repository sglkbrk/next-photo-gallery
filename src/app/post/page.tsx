import Grid3Images from '@/components/Grid/Grid3Images';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BsGallery - Post',
  description:
    'Discover high-resolution photographs and in-depth articles from around the world | Dünyanın dört bir yanından yüksek çözünürlüklü fotoğraflar ve detaylı makaleler keşfedin.'
};

async function fetchProjects() {
  const res = await fetch(process.env.NEXT_PUBLIC_SITE_URL + `/api/Projects`, {
    cache: 'no-store' // SSR için cache'i kapatıyoruz
  });

  if (!res.ok) {
    throw new Error('Veri çekme işlemi başarısız oldu');
  }

  return res.json();
}

export default async function gallery() {
  const projects = await fetchProjects();
  return (
    <div className="flex-grow">
      <Grid3Images projects={projects} />
    </div>
  );
}
