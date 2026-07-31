import SlideShow from '../components/Slideshow/SlideShow';
import type { Metadata } from 'next';
import { fetchApi } from '@/lib/fetch-api';
import type { Project } from '@/types/gallery';

export const metadata: Metadata = {
  title: 'BsGallery - Home',
  description:
    'Discover high-resolution photographs and in-depth articles from around the world | Dünyanın dört bir yanından yüksek çözünürlüklü fotoğraflar ve detaylı makaleler keşfedin.'
};

export default async function Home() {
  const projects = await fetchApi<Project[]>('/api/projects/home/8', 3600);
  return <SlideShow images={projects} />;
}
