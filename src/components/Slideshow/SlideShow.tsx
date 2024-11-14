'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import config from '@/config/config';
import Image from 'next/image';

interface SlideshowProps {
  images: {
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
  }[];
}

export default function SlideShow({ images }: SlideshowProps) {
  const [showHint, setShowHint] = useState(true);
  const [isHovered, setIsHovered] = useState<number>(-1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && window.innerWidth > 1024) {
      container.scrollLeft = 550;
    }
  }, [images]);
  useEffect(() => {
    // Belirli bir süre sonra kaydırma göstergesini kaldır
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3000); // 3 saniye sonra kaybolacak

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={scrollContainerRef} className="flex overflow-x-auto h-screen scroll-smooth">
      <div id="scroll" className="flex sm:space-x-8">
        {showHint && (
          <div className="absolute top-1/2 z-10  left-4 transform -translate-y-1/2 animate-bounce text-gray-300 font-semibold">
            <span className="mr-2">→</span> Swipe right
          </div>
        )}
        <div className="min-w-[550px] h-full flex items-center justify-center hidden sm:block "></div>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative h-full  w-full w-screen sm:w-[80vw] md:w-[45vw] lg:w-[35vw] xl:w-[25vw]  flex items-center justify-center"
          >
            <Image
              fill
              onMouseEnter={() => setIsHovered(index)}
              onMouseLeave={() => setIsHovered(-1)}
              src={config.apiEndpoints.downloadFile + image.mainImageUrl}
              alt={image.title}
              objectFit="cover"
              className="object-cover h-full p-3 sm:p-0"
            />
            <div
              onMouseEnter={() => setIsHovered(index)}
              onMouseLeave={() => setIsHovered(-1)}
              className={`absolute  bg-black opacity-80  hover:opacity-100  w-64 h-36 flex flex-col items-center justify-center z-10 space-y-4  ${
                index !== isHovered ? 'hidden' : ''
              }`}
            >
              <Link href={'/' + image.slug} className="text-white text-lg font-bold items-center justify-center">
                {image.title}
              </Link>
              <span className="text-[10px] text-gray-300 items-center justify-center">{image.city}</span>
            </div>
          </div>
        ))}
        <div className="min-w-[550px] h-full flex items-center justify-center hidden sm:block  "></div>
      </div>
    </div>
  );
}
