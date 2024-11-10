import SlideShowVNav from '@/components/Slideshow/SlideShowVNav';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: {
    slug: string;
  };
}

async function fetchProjects(id: string) {
  const res = await fetch(`http://localhost:5001/api/Projects/${id}/0`, {
    cache: 'no-store' // SSR için cache'i kapatıyoruz
  });
  if (!res.ok) notFound();

  return res.json();
}

export default async function PhotoPage({ params }: PostPageProps) {
  const { slug } = await params;
  const data = await fetchProjects(slug);
  return <div className="overflow-hidden">{<SlideShowVNav photo={data} />}</div>;
  // return <SlideShowVNav photo={data} />;
}
