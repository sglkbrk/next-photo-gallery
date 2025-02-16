'use client';
import Image from 'next/image';
interface BannerFullScreenProps {
  image: string;
  title: string;
  ctiy: string;
}
export default function BannerFullScreen({ image, title, ctiy }: BannerFullScreenProps) {
  return (
    <div className="relative w-full  h-[600px]  max-h-[600px] flex items-center justify-center p-8 ">
      <Image width={1000} height={1000} src={image} className="object-cover z-0 object-center w-full h-full" alt={title} />
      <div className="flex flex-col items-center justify-center z-10 absolute bg-black w-96 h-44 opacity-90 space-y-4">
        <h1 className="text-white text-[13px] font-effra uppercase tracking-7">{title}</h1>
        <h3 className="text-white text-[11px] font-effra uppercase tracking-6">{ctiy}</h3>
      </div>
    </div>
  );
}
