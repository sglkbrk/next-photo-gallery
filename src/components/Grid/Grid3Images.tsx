'use client';
import { useState } from 'react';
import Link from 'next/link';
import config from '@/config/config';
import Image from 'next/image';

interface SlideshowProps {
  projects: {
    mainImageUrl: string;
    city: string;
    slug: string;
    category: number;
  }[];
}
export default function GridImages({ projects }: SlideshowProps) {
  const [isHovered, setIsHovered] = useState<number>(-1);
  return (
    <div className="flex-col items-center justify-center mb-8 mt-8">
      <div id="scroll" className={`grid gap-2 sm:gap-3 md:gap-6 xl:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 m-4 md:m-0  `}>
        {projects.map((image, index) => (
          <div
            key={index}
            onMouseEnter={() => setIsHovered(index)}
            onMouseLeave={() => setIsHovered(-1)}
            className={`relative w-fullitems-end justify-center ${index !== isHovered && isHovered != -1 ? 'opacity-70' : ''}`}
          >
            <div className="relative flex flex-col items-center justify-center h-[351px]">
              <Image
                fill
                src={config.apiEndpoints.downloadFile + image.mainImageUrl}
                className="object-cover object-center w-full h-full rounded-lg"
                alt={image.mainImageUrl}
              />
              <div className="flex flex-col items-center justify-center z-10 absolute bg-black p-2  mb-4 opacity-70  hover:opacity-100 space-y-4">
                <Link href={'/' + image.slug} className="text-white text-[11px] font-effra uppercase tracking-6">
                  {image.city}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
