import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BsGallery - About',
  description:
    'Discover high-resolution photographs and in-depth articles from around the world | Dünyanın dört bir yanından yüksek çözünürlüklü fotoğraflar ve detaylı makaleler keşfedin.'
};
export default function Aboutme() {
  return (
    <div className="h-screen overflow-hidden w-full ">
      <div id="scroll" className="relative w-full  overflow-hidden   h-full flex items-center justify-center  mb-8 mt-8 ">
        <img
          src="https://gallery.buraksaglik.com/api/MinioFile/download/588fc047-34ca-458c-9f8b-bf8839227162.jpeg"
          className="object-cover  object-center w-full h-full blur-sm"
        />
        <div className="items-center justify-center absolute z-10  bg-black p-8  left-2 right-2 md:left-8 md:right-8  space-y-4  ">
          <div className="grid md:grid-cols-12 grid-cols-1 ">
            <div className="md:col-span-10 ">
              <div className="grid  grid-cols-2  md:grid-cols-4 gap-x-20   mr-20  ">
                <div>
                  <p className="text-white text-[14px] font-bold">Name</p>
                  <p className="text-white text-[13px] ">Burak Sağlık</p>
                </div>
                <div>
                  <p className="text-white text-[14px] font-bold">Title</p>
                  <p className="text-white text-[13px] ">Software developer & Photographer</p>
                </div>
                <div>
                  <p className="text-white text-[14px] font-bold">Date</p>
                  <p className="text-white text-[13px]">02.05.1996</p>
                </div>
                <div>
                  <p className="text-white text-[14px] font-bold">Place</p>
                  <p className="text-white text-[13px]">Istanbul</p>
                </div>
              </div>
              <p className="text-gray-400 text-[13px]   mt-10 mr-8 font-extralight tracking-3"></p>
              <p className="text-gray-400 text-[13px] mt-10 font-extralight mr-8 tracking-3">
                I graduated as the top of my class from Sivas Cumhuriyet University in 2018 with a degree in Management Information Systems.
                I started my career in 2016 at Detaysoft as a Web and Mobile Developer. During this time, I gained experience working as a
                Frontend Developer, Mobile Developer, and SAP Fiori Developer, contributing to both web and mobile projects. I develop
                dynamic applications using modern technologies such as React.js and Vue.js, while also creating enterprise solutions with
                SAP Fiori. I continue my professional journey at Detaysoft, aiming to add value to my projects by keeping up with
                technological advancements.
              </p>
              <div className="flex flex-row items-center  mt-10 mr-8 justify-between">
                <p className="text-white text-[13px] font-extralight tracking-3">sglk.brk@gmail.com</p>
                <div>
                  <nav className="flex-1">
                    <ul className="grid grid-cols-3  justify-items-center  space-x-4">
                      <li>
                        <a className="text-gray-300 text-[15px]" href="#">
                          <FaLinkedin />
                        </a>
                      </li>
                      <li>
                        <a className="text-gray-300 text-[15px]" href="#">
                          <FaGithub />
                        </a>
                      </li>
                      <li>
                        <a className="text-gray-300 text-[15px]" href="#">
                          <FaInstagram />
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            <div className="md:col-span-2   mt-2 md:mt-0 justify-items-end  w-full h-96 md:h-60  ">
              <img src="https://buraksaglik.com/assets/images/banner/IMG_0419.jpeg" className="object-cover  object-center w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
