import GridFiterImages from '@/components/Grid/GridFiterImages';
import { fetchApi } from '@/lib/fetch-api';
import type { Photo } from '@/types/gallery';

export default async function gallery() {
  const projects = await fetchApi<Photo[]>('/api/photo', 3600);
  return (
    <div className="flex-grow">
      <GridFiterImages projects={projects} />
    </div>
  );
}
