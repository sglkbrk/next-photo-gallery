'use client';
import Link from 'next/link';
import { useState } from 'react';
import config from '@/config/config';

interface Photo {
  id: number;
  photoUrl: string;
  description: string;
}
interface images {
  id: number;
  title: string;
  description: string;
  city: string;
  client: string;
  photographer: string;
  camera: string;
  category: string;
  website_url: string;
  main_image_url: string;
  slug: string;
  created_at: Date;
  photos: Photo[];
}
export default function SlideShowDetail({ images }: { images: images }) {
  const [isHovered, setIsHovered] = useState<number>(-1);
  return (
    <div className="flex overflow-x-auto scroll-smooth">
      <div id="scroll" className="flex sm:space-x-8">
        <div className="flex flex-col justify-center items-end p-12 min-w-[350px] h-full  hidden sm:flex  space-y-8">
          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-right text-[15px] font-bold">Title</p>
            <p className="text-gray-500  text-right  text-[14px]">{images.title}</p>
          </div>
          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-right text-[15px] font-bold">Client</p>
            <p className="text-gray-500  text-right  text-[14px]">{images.client}</p>
          </div>
          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-right text-[15px] font-bold">Photographer</p>
            <p className="text-gray-500  text-right  text-[14px]">{images.photographer}</p>
          </div>
          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-right text-[15px] font-bold">Camera</p>
            <p className="text-gray-500  text-right  text-[14px]">{images.camera}</p>
          </div>
          <div className="flex flex-col min-w-[100px] space-y-1">
            <p className="text-white text-right text-[15px] font-bold">Category</p>
            <p className="text-gray-500  text-right  text-[14px]">{images.category}</p>
          </div>
        </div>
        {images.photos.map((image, index) => (
          <div key={index} className="relative  w-screen sm:w-auto  sm:min-w-max h-full flex items-center justify-center">
            <img
              onMouseEnter={() => setIsHovered(index)}
              onMouseLeave={() => setIsHovered(-1)}
              src={config.apiEndpoints.downloadFile + image.photoUrl}
              className={`object-cover h-full  rounded-lg z-0 ${index !== isHovered && isHovered != -1 ? 'opacity-60' : ''}`}
              alt={image.description}
            />
            <div
              onMouseEnter={() => setIsHovered(index)}
              onMouseLeave={() => setIsHovered(-1)}
              className={`absolute  bg-black opacity-80  hover:opacity-100  w-64 h-36 flex flex-col items-center justify-center z-10 space-y-4  ${
                index !== isHovered ? 'hidden' : ''
              }`}
            >
              <Link href={''} className="text-white text-lg font-bold items-center justify-center">
                {image.description}
              </Link>
              <span className="text-[10px] text-gray-300 items-center justify-center">{image.description}</span>
            </div>
          </div>
        ))}
        <div className="min-w-[550px] h-full flex items-center justify-center hidden sm:block  "></div>
      </div>
    </div>
  );
}
