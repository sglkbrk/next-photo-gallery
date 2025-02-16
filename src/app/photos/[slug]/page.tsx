import SlideShowInfo from '@/components/Slideshow/SlideShowInfo';
import { notFound } from 'next/navigation';
import config from '@/config/config';
import type { Metadata } from 'next';

type Params = Promise<{ slug: string }>;
async function fetchProjects(id: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_SITE_URL + `/api/Projects/${id}/1`, {
    cache: 'no-store' // SSR için cache'i kapatıyoruz
  });
  if (!res.ok) notFound();

  return res.json();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchProjects(slug);
  console.log(post);
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

export default async function PhotoPage(props: { params: Params }) {
  const { slug } = await props.params;
  const data = await fetchProjects(slug);
  return <SlideShowInfo photo={data} />;
}
