'use client';
import Link from 'next/link';
import { useState } from 'react';
import config from '@/config/config';
import Image from 'next/image';

interface SlideshowProps {
  projects: {
    id: number;
    title: string;
    description: string;
    city: string;
    client: string;
    photographer: string;
    camera: string;
    category: number;
    websiteUrl: string;
    mainImageUrl: string;
    slug: string;
    status: number;
    homePage: boolean;
    createdAt: string; // ISO date string
    photos: [];
  }[];
}
export default function RecentProjects({ projects }: SlideshowProps) {
  const [isHovered, setIsHovered] = useState<number>(-1);
  return (
    <div className="flex-col items-center justify-center mb-8 mt-8">
      <div className="flex items-center justify-center">
        <h5 className="text-white text-[18px] font-effra uppercase justify-center tracking-5 mb-8">Recent Projects</h5>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
        {projects.map((project, index) => (
          <div
            key={index}
            onMouseEnter={() => setIsHovered(index)}
            onMouseLeave={() => setIsHovered(-1)}
            className="relative w-full h-96 md:h-64 lg:h-72 flex items-end justify-center "
          >
            <Image
              fill
              alt={project.title}
              src={config.apiEndpoints.downloadFile + project.mainImageUrl}
              className={`object-cover z-0 object-center w-full h-full ${index !== isHovered && isHovered != -1 ? 'opacity-30' : ''}`}
            />
            <div className="z-10 absolute bg-black opacity-70 hover:opacity-100 p-4 h-8 mb-4 flex flex-col items-center justify-center">
              <Link href={`/${project.slug}`} className="">
                <h2 className="text-white text-[13px] font-effra uppercase tracking-6"> {project.title}</h2>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
