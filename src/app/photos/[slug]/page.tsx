import SlideShowInfo from '@/components/Slideshow/SlideShowInfo';
import { notFound } from 'next/navigation';

type Params = Promise<{ slug: string }>;

async function fetchProjects(id: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_SITE_URL + `/api/Projects/${id}/1`, {
    cache: 'no-store' // SSR için cache'i kapatıyoruz
  });
  if (!res.ok) notFound();

  return res.json();
}

export default async function PhotoPage(props: { params: Params }) {
  const { slug } = await props.params;
  const data = await fetchProjects(slug);
  console.log(data);
  return <SlideShowInfo photo={data} />;
}
