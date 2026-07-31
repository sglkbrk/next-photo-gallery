import Grid3Images from '@/components/Grid/Grid3Images';
import { fetchApi } from '@/lib/fetch-api';
import type { Project } from '@/types/gallery';

export default async function gallery() {
  const projects = await fetchApi<Project[]>('/api/projects', 3600);
  return (
    <div className="flex-grow">
      <Grid3Images projects={projects} />
    </div>
  );
}
