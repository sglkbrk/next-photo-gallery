'use client';
import { useEffect, useRef, useState } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

interface SlideshowProps {
  images: string[];
  cols?: number;
}
export default function GridImages({ images, cols }: SlideshowProps) {
  const [isHovered, setIsHovered] = useState<number>(-1);
  useEffect(() => {
    let lightbox = new PhotoSwipeLightbox({
      gallery: '#scroll',
      children: 'a',
      pswpModule: () => import('photoswipe')
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, []);
  return (
    <div id="scroll" className={`grid gap-4 sm:gap-6 md:gap-8 xl:gap-12 grid-cols-1 md:grid-cols-4 m-4 md:m-0  `}>
      {images.map((image, index) => (
        <a key={index} href={image} data-pswp-width="1875" data-pswp-height="2500" className="w-full">
          <img
            onMouseEnter={() => setIsHovered(index)}
            onMouseLeave={() => setIsHovered(-1)}
            src={image}
            alt={`Image ${index + 1}`}
            className={`object-cover object-center w-full h-[500px] rounded-lg ${
              index !== isHovered && isHovered != -1 ? 'opacity-30' : ''
            }`}
          />
        </a>
      ))}
    </div>
  );
}
