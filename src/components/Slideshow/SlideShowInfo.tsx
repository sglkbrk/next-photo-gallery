'use client';
import { useEffect, useState, useRef } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import config from '@/config/config';
import Image from 'next/image';
interface Photo {
  photoUrl: string;
  width: number;
  height: number;
  title: string;
  description: string;
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && window.innerWidth < 1024) {
      container.scrollLeft = 350;
    }
  }, [photo]);
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
    <div ref={scrollContainerRef} className="flex overflow-x-auto h-screen scroll-smooth duration-500">
      <div id="scroll" className="flex sm:space-x-8">
        {showHint && (
          <div className="absolute top-1/2 z-10  left-4 transform -translate-y-1/2 animate-bounce text-gray-300 font-semibold">
            <span className="mr-2">→</span> Swipe right
          </div>
        )}
        <div className="flex flex-col justify-center items-end p-12 min-w-[350px] h-full   sm:flex  space-y-8">
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
          <div
            key={index}
            className="relative h-full  w-full w-screen sm:w-[80vw] md:w-[45vw] lg:w-[35vw] xl:w-[25vw]  flex items-end justify-center"
          >
            <a
              href={config.apiEndpoints.downloadFile + image.photoUrl}
              data-pswp-height={image.height ? image.height : 2500}
              data-pswp-width={image.width ? image.width : 1875}
            >
              <Image
                fill
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(-1)}
                src={config.apiEndpoints.downloadFile + image.photoUrl}
                alt={image.title}
                objectFit="cover"
                className="object-cover h-full p-3 sm:p-0"
              />
            </a>
            <div
              onMouseEnter={() => setIsHovered(index)}
              onMouseLeave={() => setIsHovered(-1)}
              className={`absolute  bg-black opacity-80  hover:opacity-100  p-2 flex flex-col items-center justify-center z-10 space-y-4  ${
                index !== isHovered ? 'hidden' : ''
              }`}
            >
              <span className="text-[10px] text-gray-300 items-center justify-center">{image.title}</span>
            </div>
          </div>
        ))}
        <div className="min-w-[550px] h-full flex items-center justify-center hidden sm:block  "></div>
      </div>
    </div>
  );
}
