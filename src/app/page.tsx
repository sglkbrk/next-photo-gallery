import SlideShow from '../components/Slideshow/SlideShow';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BsGallery - Home',
  description: 'My Gallery'
};
// import SlideShowInfo from '../components/Slideshow/SlideShowInfo';
// import SlideShowDetail from '../components/Slideshow/SlideShowDetail';
// import RecentProjects from '../components/RecentProjects/RecentProjects';
// import BannerFullScreen from '../components/Banner/BannerFullScreen';
// import Showdeteil from '../components/Card/Showdeteil';
// import FullScreen from '@/components/Card/FullScreen';
// import ProjectsNavigation from '@/components/ProjectsNavigation/ProjectsNavigation';
// import SlideShowVNav from '@/components/Slideshow/SlideShowVNav';
// import Grid2Images from '@/components/Grid/Grid2Images';
// import Grid3Images from '@/components/Grid/Grid3Images';
// import Grid4Images from '@/components/Grid/Grid4Images';

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
