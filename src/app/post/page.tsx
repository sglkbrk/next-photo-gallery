import Grid3Images from '@/components/Grid/Grid3Images';

async function fetchProjects() {
  const res = await fetch(`http://localhost:5001/api/Projects`, {
    cache: 'no-store' // SSR için cache'i kapatıyoruz
  });

  if (!res.ok) {
    throw new Error('Veri çekme işlemi başarısız oldu');
  }

  return res.json();
}

export default async function gallery() {
  const projects = await fetchProjects();
  return (
    <div className="flex-grow">
      <Grid3Images projects={projects} />
    </div>
  );
}
