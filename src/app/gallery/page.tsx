import GridFiterImages from '@/components/Grid/GridFiterImages';
async function fetchProjects() {
  const res = await fetch(process.env.NEXT_PUBLIC_SITE_URL + `/api/photo`, {
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
      <GridFiterImages projects={projects} />
    </div>
  );
}
