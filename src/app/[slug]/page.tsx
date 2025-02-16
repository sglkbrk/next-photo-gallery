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

async function fetchSlugs() {
  const res = await fetch(process.env.NEXT_PUBLIC_SITE_URL + `/api/projects/slugs`, {
    cache: 'no-store' // SSR için cache'i kapatıyoruz
  });
  if (!res.ok) notFound();
  return res.json();
}
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchProjects(slug);
  if (!post) {
    return {
      title: '404 - Not Found',
      description: 'The post you are looking for does not exist.'
    };
  }
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: 'https://gallery.buraksaglik.com'
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://gallery.buraksaglik.com/${slug}`,
      images: [
        {
          url: config.apiEndpoints.downloadFile + post.mainImageUrl || '/screenshot.png',
          width: 800,
          height: 600,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [config.apiEndpoints.downloadFile + post.mainImageUrl || '/screenshot.png']
    }
  };
}
export default async function ProjectPage(props: { params: Params }) {
  const { slug } = await props.params;
  const data = await fetchProjects(slug);
  const himage = data.photos.filter((x: Photo) => x.format == 0);
  const vimage = data.photos.filter((x: Photo) => x.format == 1);
  const recentProject = await fetchRecentProjects();
  const slugs = await fetchSlugs();
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
      <ProjectsNavigation slugs={slugs} slug={slug} />
      <RecentProjects projects={recentProject} />
    </div>
  );
}
