import RecentProjects from '@/components/RecentProjects/RecentProjects';
import BannerFullScreen from '@/components/Banner/BannerFullScreen';
import Showdeteil from '@/components/Card/Showdeteil';
import FullScreen from '@/components/Card/FullScreen';
import ProjectsNavigation from '@/components/ProjectsNavigation/ProjectsNavigation';
import GalleryGrid from '@/components/Grid/GalleryGrid';
import GalleryHGrid from '@/components/Grid/GalleryHGrid';
import { notFound } from 'next/navigation';
import { getImageUrl } from '@/config/config';
import type { Metadata } from 'next';
import { fetchApi } from '@/lib/fetch-api';
import type { Photo, Project } from '@/types/gallery';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchApi<Project>(`/api/projects/${slug}`, 86400);

  if (!post) {
    return {
      title: '404 - Not Found',
      description: 'The post you are looking for does not exist.'
    };
  }

  const imageUrl = getImageUrl(post.mainImageUrl);

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
          url: imageUrl,
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
      images: [imageUrl]
    }
  };
}

export default async function ProjectPage(props: { params: Params }) {
  const { slug } = await props.params;
  const data = await fetchApi<Project>(`/api/projects/${slug}`, 86400);
  const recentProject = await fetchApi<Project[]>('/api/projects/recent/4', 3600);
  const slugs = await fetchApi<string[]>('/api/projects/slugs', 3600);

  if (!data) {
    notFound();
  }

  const himage = (data.photos ?? []).filter((x: Photo) => x.format === 0);
  const vimage = (data.photos ?? []).filter((x: Photo) => x.format === 1);
  const cc = (data.description ?? '')
    .split('&')
    .map((part) => part.trim())
    .filter(Boolean);
  const heroPhoto = himage[0];
  const detailPhoto = himage[1];
  const fullScreenPhoto = himage[2];

  return (
    <div>
      <BannerFullScreen image={getImageUrl(heroPhoto?.photoUrl ?? data.mainImageUrl)} title={data.title} ctiy={data.city} />
      <div className="ml-4 mr-4 xl:ml-64 xl:mr-64">
        {cc[0] ? <p className="text-gray-400 text-[15px] font-effra">{cc[0]}</p> : null}
        {detailPhoto ? <Showdeteil photo={detailPhoto} /> : null}
        {cc[1] ? <p className="text-gray-400 text-[15px] font-effra">{cc[1]}</p> : null}
        {fullScreenPhoto ? <FullScreen photo={fullScreenPhoto} /> : null}
        {cc[2] ? <p className="text-gray-400 text-[15px] font-effra">{cc[2]}</p> : null}
        {himage.slice(3).length > 0 ? <GalleryHGrid photos={himage.slice(3)} slug={'/photosh/' + slug} /> : null}
        {vimage.length > 0 ? <GalleryGrid photos={vimage} slug={'/photos/' + slug} /> : null}
      </div>
      <ProjectsNavigation slugs={slugs} slug={slug} />
      <RecentProjects projects={recentProject} />
    </div>
  );
}
