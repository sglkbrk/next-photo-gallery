import SlideShowInfo from '@/components/Slideshow/SlideShowInfo';
import { notFound } from 'next/navigation';
import { getImageUrl } from '@/config/config';
import type { Metadata } from 'next';
import { fetchApi } from '@/lib/fetch-api';
import type { Project } from '@/types/gallery';

type Params = Promise<{ slug: string }>;

async function fetchProjects(id: string) {
  try {
    return await fetchApi<Project>(`/api/projects/${id}/1`, 86400);
  } catch {
    notFound();
  }
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

export default async function PhotoPage(props: { params: Params }) {
  const { slug } = await props.params;
  const data = await fetchProjects(slug);
  return <SlideShowInfo photo={data} />;
}
