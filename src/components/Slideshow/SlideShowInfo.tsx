'use client';
import { useEffect, useState } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import config from '@/config/config';

interface Photo {
  photoUrl: string;
  width: number;
  height: number;
}
interface SlideshowProps {
  photo: {
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
    photos: Photo[];
  };
}
export default function SlideShowInfo({ photo }: SlideshowProps) {
  const [showHint, setShowHint] = useState(true);
  const [isHovered, setIsHovered] = useState<number>(-1);
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#scroll',
      children: 'a',
      pswpModule: () => import('photoswipe')
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, []);
  useEffect(() => {
    // Belirli bir süre sonra kaydırma göstergesini kaldır
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3000); // 3 saniye sonra kaybolacak

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="flex   overflow-x-auto  scroll-smooth">
      {showHint && (
        <div className="absolute top-1/2 z-10  left-4 transform -translate-y-1/2 animate-bounce text-gray-300 font-semibold">
          <span className="mr-2">→</span> Swipe right
        </div>
      )}
      <div id="scroll" className="flex sm:space-x-8">
        <div className="flex flex-col justify-center items-end p-12 min-w-[350px] h-full  hidden sm:flex  space-y-8">
          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-right text-[15px] font-bold">Title</p>
            <p className="text-gray-500  text-right  text-[14px]">{photo.title}</p>
          </div>
          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-right text-[15px] font-bold">Client</p>
            <p className="text-gray-500  text-right  text-[14px]">{photo.client}</p>
          </div>
          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-right text-[15px] font-bold">Photographer</p>
            <p className="text-gray-500  text-right  text-[14px]">{photo.photographer}</p>
          </div>
          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-right text-[15px] font-bold">Camera</p>
            <p className="text-gray-500  text-right  text-[14px]">{photo.camera}</p>
          </div>
          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-right text-[15px] font-bold">Category</p>
            <p className="text-gray-500  text-right  text-[14px]">{photo.category}</p>
          </div>
        </div>
        {photo.photos.map((image, index) => (
          <a
            href={config.apiEndpoints.imageUrl + image.photoUrl}
            key={index}
            className="w-screen sm:w-auto  sm:min-w-max h-full flex items-center justify-center  "
            data-pswp-width={image.width ? image.width : 1875}
            data-pswp-height={image.height ? image.height : 2500}
          >
            <img
              onMouseEnter={() => setIsHovered(index)}
              onMouseLeave={() => setIsHovered(-1)}
              src={config.apiEndpoints.imageUrl + image.photoUrl}
              className={`object-cover h-full  rounded-lg ${index !== isHovered && isHovered != -1 ? 'opacity-60' : ''}`}
              alt="image"
            />
          </a>
        ))}
        <div className="min-w-[550px] h-full flex items-center justify-center hidden sm:block  "></div>
      </div>
    </div>
  );
}
