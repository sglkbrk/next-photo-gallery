'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import config from '@/config/config';

interface Photo {
  photoUrl: string;
}
interface FullScreenProps {
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
export default function SlideShowVNav({ photo }: FullScreenProps) {
  const [imgSy, setImagSy] = useState<number>(0);

  const setImage = (index: number) => {
    if (index < 0) {
      setImagSy(photo.photos.length - 1);
    } else if (index > photo.photos.length - 1) {
      setImagSy(0);
    } else {
      setImagSy(index);
    }
  };
  useEffect(() => {}, []);
  return (
    <div className="flex flex-row  h-full justify-center items-end ml-0 mr-0  xxxl:ml-16 xxxl:mr-16 ">
      <div id="scroll" className=" w-full   h-screen  flex items-center justify-center md:justify-end  ">
        <div className="flex flex-col md:hidden  mt-32">
          <FaChevronLeft onClick={() => setImage(imgSy - 1)} className="text-white text-3xl" />
        </div>
        <a className="h-full w-screen justify-start justify-center items-center">
          <img
            src={config.apiEndpoints.downloadFile + photo.photos[imgSy].photoUrl}
            className="object-cover  object-center  w-full w-screen md:pr-8 h-screen"
          />
        </a>
        <div className="flex flex-col md:hidden  mt-32">
          <FaChevronRight onClick={() => setImage(imgSy + 1)} className="text-white text-3xl" />
        </div>
        <div className="flex flex-col justify-center items-center z-10 absolute hidden md:flex mt-48 w-56 space-y-4 ">
          {photo.photos.map((image, index) => (
            <div
              key={index}
              onClick={() => setImage(index)}
              className="flex w-56 h-16 hower:w-56 hover:h-16  items-center justify-end hower:justify-between  z-30 group "
            >
              <img
                src={config.apiEndpoints.downloadFile + image.photoUrl}
                className="flex w-32 h-full object-cover object-center hidden group-hover:flex"
              />
              <div className="w-0 h-0.5 bg-white my-4 group-hover:w-16 transition-all duration-500 ease-out"></div>
              <span className="w-2 h-2 bg-gray-500  group-hover:bg-white  hover:w-3 hover:h-3 rounded-full"></span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center z-20 absolute bg-black p-2  mb-4 opacity-90 space-y-4">
        <Link href={''} className="text-white text-[11px] font-effra uppercase tracking-6">
          london
        </Link>
      </div>
    </div>
  );
}
