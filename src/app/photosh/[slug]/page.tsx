import SlideShowVNav from '@/components/Slideshow/SlideShowVNav';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BsGallery - Photo',
  description: 'My Gallery'
};

type Params = Promise<{ slug: string }>;

async function fetchProjects(id: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_SITE_URL + `/api/Projects/${id}/0`, {
    cache: 'no-store' // SSR için cache'i kapatıyoruz
  });
  if (!res.ok) notFound();

  return res.json();
}

export default async function PhotoPage(props: { params: Params }) {
  const { slug } = await props.params;
  const data = await fetchProjects(slug);
  return <div className="overflow-hidden">{<SlideShowVNav photo={data} />}</div>;
  // return <SlideShowVNav photo={data} />;
}
