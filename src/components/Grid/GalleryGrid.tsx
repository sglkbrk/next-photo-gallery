'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import config from '@/config/config';

interface Photo {
  id: number;
  photoUrl: string;
  description: string;
  format: number;
  height: number;
  width: number;
  title: string;
}
interface GalleryGridProps {
  photos: Photo[];
  slug: string;
}
export default function GalleryGrid({ photos, slug }: GalleryGridProps) {
  const [isHovered, setIsHovered] = useState<number>(-1);
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#GalleryGrid_id',
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
      <div className="flex items-center justify-center">
        {/* <h5 className="text-white text-[18px] font-effra uppercase justify-center tracking-5 mb-8">Recent Projects</h5> */}
      </div>
      <div id="GalleryGrid_id" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
        {photos.map((image, index) => (
          <div
            key={index}
            onMouseEnter={() => setIsHovered(index)}
            onMouseLeave={() => setIsHovered(-1)}
            className="relative w-full h-96 md:h-64 xxl:h-96 flex items-end justify-center "
          >
            <a
              href={config.apiEndpoints.downloadFile + image.photoUrl}
              data-pswp-width={image.width}
              data-pswp-height={image.height}
              className="pswp-gallery__item  z-0  w-full h-full "
            >
              <img
                src={config.apiEndpoints.downloadFile + image.photoUrl}
                className={`object-cover object-center w-full h-full ${index !== isHovered && isHovered != -1 ? 'opacity-70' : ''}`}
              />
            </a>
            <div className="z-10 absolute bg-black  h-8 mb-4  p-4 flex flex-col items-center justify-center">
              <div className="text-white text-[10px] font-effra uppercase tracking-5">{image.title}</div>
            </div>
          </div>
        ))}
      </div>
      {photos.length && (
        <div className="flex items-center justify-center mt-8">
          <Link href={slug} className=" items-center h-full justify-center border border-white  border-[0.5px]  p-2 ">
            <h5 className="text-white text-[13px] font-effra uppercase justify-center tracking-5 ml-1">View All</h5>
          </Link>
        </div>
      )}
    </div>
  );
}
