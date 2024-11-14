'use client';
import { useState, useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import Filters from '@/components/Filters/Filters';
import config from '@/config/config';
import Image from 'next/image';

interface SlideshowProps {
  projects: {
    id: number;
    photoUrl: string;
    description: string;
    category: number;
    city: string;
    width: number;
    height: number;
  }[];
}
export default function GridFiterImages({ projects }: SlideshowProps) {
  const [isHovered, setIsHovered] = useState<number>(-1);
  const [selectedCategory, setSelectedCategory] = useState<number>(-1);

  const handleCategoryChange = (category: number) => {
    setSelectedCategory(category);
  };
  const getItems = (category: number) => {
    if (category === -1) return projects;
    else return projects.filter((project) => project.category === category);
  };
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#scroll',
      children: '.pswp-gallery__item',
      pswpModule: () => import('photoswipe')
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, []);
  return (
    <div className="flex-col items-center justify-center mb-8 mt-8">
      <Filters onCategoryChange={handleCategoryChange} />
      <div id="scroll" className={`grid gap-2 sm:gap-3 md:gap-6 xl:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 m-4 md:m-0  `}>
        {getItems(selectedCategory).map((image, index) => (
          <div
            key={index}
            onMouseEnter={() => setIsHovered(index)}
            onMouseLeave={() => setIsHovered(-1)}
            className={`relative w-fullitems-end justify-center ${index !== isHovered && isHovered != -1 ? 'opacity-70' : ''}`}
          >
            <a
              href={config.apiEndpoints.imageUrl + image.photoUrl}
              data-pswp-width={image.width}
              data-pswp-height={image.height}
              className="relative pswp-gallery__item  flex flex-col items-center justify-center h-[351px]"
            >
              <Image
                fill
                src={config.apiEndpoints.downloadFile + image.photoUrl}
                className="object-cover object-center w-full h-full rounded-lg"
                alt={image.description}
              />
              <div className="flex flex-col items-center justify-center z-10 absolute bg-black p-2  mb-4 opacity-70  hover:opacity-100 space-y-4">
                <div className="text-white text-[11px] font-effra uppercase tracking-6">{image.city}</div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
