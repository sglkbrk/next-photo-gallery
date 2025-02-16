'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import config from '@/config/config';
interface SlideshowProps {
  photo: {
    title: string;
    description: string;
    category: string;
    photographer: string;
    camera: string;
    city: string;
    client: string;
    photoUrl: string;
    lens: string;
    focalLength: string;
    width: number;
    height: number;
  };
}
export default function Showdeteil({ photo }: SlideshowProps) {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#showDeteilImage_id',
      children: '.pswp-gallery__item',
      pswpModule: () => import('photoswipe')
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, []);
  return (
    <div className="flex overflow-x-auto scroll-smooth mt-8 mb-8">
      <div className="grid grid-cols-1  md:grid-cols-12 sm:space-x-8">
        <div className="flex    md:col-span-2 flex-col justify-start items-start   min-w-[100px]  h-full    space-y-4">
          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-left text-[15px] font-bold">Title</p>
            <h1 className="text-gray-500 text-[14px]">{photo.title}</h1>
          </div>

          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-left text-[15px] font-bold">Photographer</p>
            <h1 className="text-gray-500 text-[14px]">{photo.photographer}</h1>
          </div>
          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-left text-[15px] font-bold">Camera</p>
            <p className="text-gray-500 text-[14px]">{photo.camera}</p>
          </div>
          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-left text-[15px] font-bold">Lens</p>
            <p className="text-gray-500 text-[14px]">{photo.lens}</p>
          </div>
          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-left text-[15px] font-bold">Focal Length</p>
            <p className="text-gray-500 text-[14px]">{photo.focalLength}</p>
          </div>
        </div>
        <div
          id="showDeteilImage_id"
          className="relative md:col-span-10 w-full  max-h-[500px] flex items-end justify-center md:p-8 mt-8 md:mt-0 "
        >
          <a
            href={config.apiEndpoints.imageUrl + photo.photoUrl}
            data-pswp-width={photo.width}
            data-pswp-height={photo.height}
            className="pswp-gallery__item justify-center items-center"
          >
            <Image
              width={photo.width}
              height={photo.height}
              alt={photo.title}
              src={config.apiEndpoints.downloadFile + photo.photoUrl}
              className="object-cover z-0 object-center w-full h-full"
            />
          </a>
          <div className="flex flex-col items-center justify-center z-10 absolute bg-black p-4 h-8 mb-4 opacity-90 space-y-4">
            <h2 className="text-white text-[11px] font-effra uppercase tracking-6">{photo.title}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
