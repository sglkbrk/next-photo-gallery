import RecentProjects from '@/components/RecentProjects/RecentProjects';
import BannerFullScreen from '@/components/Banner/BannerFullScreen';
import Showdeteil from '@/components/Card/Showdeteil';
import FullScreen from '@/components/Card/FullScreen';
import ProjectsNavigation from '@/components/ProjectsNavigation/ProjectsNavigation';
import GalleryGrid from '@/components/Grid/GalleryGrid';
import GalleryHGrid from '@/components/Grid/GalleryHGrid';
import { notFound } from 'next/navigation'; // SEO ve 404 durumları için
import config from '@/config/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BsGallery - Project',
  description: 'My Gallery'
};
type Params = Promise<{ slug: string }>;
interface Photo {
  id: number;
  photo_url: string;
  description: string;
  format: number;
}
async function fetchProjects(id: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_SITE_URL + `/api/projects/${id}`, {
    cache: 'no-store' // SSR için cache'i kapatıyoruz
  });
  if (!res.ok) notFound();
  return res.json();
}

async function fetchRecentProjects() {
  const res = await fetch(process.env.NEXT_PUBLIC_SITE_URL + `/api/projects/recent/4`, {
    cache: 'no-store' // SSR için cache'i kapatıyoruz
  });
  if (!res.ok) notFound();
  return res.json();
}
export default async function ProjectPage(props: { params: Params }) {
  const { slug } = await props.params;
  metadata.title = 'BsGallery - ' + slug;
  metadata.description = slug;
  const data = await fetchProjects(slug);
  const himage = data.photos.filter((x: Photo) => x.format == 0);
  const vimage = data.photos.filter((x: Photo) => x.format == 1);
  const recentProject = await fetchRecentProjects();
  const cc = data.description.split('&');
  if (!data || himage.length < 3) {
    notFound();
  }
  return (
    <div>
      <BannerFullScreen image={config.apiEndpoints.downloadFile + himage[0].photoUrl} title={data.title} ctiy={data.city} />
      <div className="ml-4 mr-4 xl:ml-64 xl:mr-64">
        <p className="text-gray-400 text-[15px] font-effra">{cc[0]}</p>
        <Showdeteil photo={himage[1]} />
        <p className="text-gray-400 text-[15px] font-effra">{cc[1]}</p>
        <FullScreen photo={himage[2]} />
        <p className="text-gray-400 text-[15px] font-effra">{cc[2]}</p>
        <GalleryHGrid photos={himage.slice(3, himage.length)} slug={'/photosh/' + slug} />
        <GalleryGrid photos={vimage} slug={'/photos/' + slug} />
      </div>
      <ProjectsNavigation />
      <RecentProjects projects={recentProject} />
    </div>
  );
}
