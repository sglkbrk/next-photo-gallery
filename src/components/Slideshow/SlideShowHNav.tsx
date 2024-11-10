'use client';
import { useEffect, useRef } from 'react';

interface SlideshowProps {
  images: string[];
}
export default function Slideshow({ images }: SlideshowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollLeft = 550;
    }
  }, [images]);

  return (
    <div ref={scrollContainerRef} className="flex overflow-x-auto h-screen scroll-smooth">
      <div id="scroll" className="flex sm:space-x-8">
        <div className="min-w-[550px] h-full flex items-center justify-center hidden sm:block "></div>
        {images.map((image, index) => (
          <div key={index} className="w-screen sm:w-auto  sm:min-w-max h-full flex items-center justify-center ">
            <img
              src={image}
              className="object-cover h-full  opacity-50 hover:opacity-100 rounded-lg transition-transform duration-500 translate3d(50px, 100px, 0) "
              alt="image"
            />
          </div>
        ))}
        <div className="min-w-[550px] h-full flex items-center justify-center hidden sm:block  "></div>
      </div>
    </div>
  );
}
