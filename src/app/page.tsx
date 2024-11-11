import SlideShow from '../components/Slideshow/SlideShow';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BsGallery - Home',
  description:
    'Discover high-resolution photographs and in-depth articles from around the world | Dünyanın dört bir yanından yüksek çözünürlüklü fotoğraflar ve detaylı makaleler keşfedin.'
};

async function fetchProjects() {
  const res = await fetch(process.env.NEXT_PUBLIC_SITE_URL + `/api/Projects/home/8`, {
    cache: 'no-store' // SSR için cache'i kapatıyoruz
  });

  if (!res.ok) {
    throw new Error('Veri çekme işlemi başarısız oldu');
  }

  return res.json();
}
export default async function Home() {
  const projects = await fetchProjects();
  return <SlideShow images={projects} />;
}
