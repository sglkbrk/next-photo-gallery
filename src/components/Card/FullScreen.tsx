'use client';
import { useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

interface FullScreenProps {
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
export default function FullScreen({ photo }: FullScreenProps) {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#scroll_id',
      children: '.pswp-gallery__item',
      pswpModule: () => import('photoswipe')
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, []);
  return (
    <div id="scroll_id" className="relative w-full  overflow-hidden   max-h-[600px] flex items-end justify-center  mb-8 mt-8 ">
      <a
        href={photo.photoUrl}
        data-pswp-width={photo.width}
        data-pswp-height={photo.height}
        className="pswp-gallery__item h-full justify-center items-center"
      >
        <img src={photo.photoUrl} className="object-cover  object-center w-full h-full" />
      </a>
      <div className="flex flex-col items-center justify-center z-10 absolute bg-black p-2  mb-4 opacity-90 space-y-4">
        <div className="text-white text-[11px] font-effra uppercase tracking-6">{photo.title}</div>
      </div>
    </div>
  );
}
