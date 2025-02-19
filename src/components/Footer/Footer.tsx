import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
export default function Footer() {
  return (
    <footer className="md:pl-0  pl-10 ">
      <div className="flex items-center justify-items-between h-16 md:h-20 sm:h-16  ">
        <div className="flex  justify-items-center align-items-center">
          <a href="https://buraksaglik.com" className="text-gray-700 text-[12px]">
            <h2 className="text-[12px] text-gray-500">BsGallery @Burak Sağlık</h2>
          </a>
        </div>
        <div className="flex-1 justify-center items-center  ">
          <div className="hidden md:flex  justify-center items-center space-x-2">
            <h3 className="flex flex-col text-[12px] text-gray-500">
              &copy; All rights reserved. Images licensed for personal use only. No commercial use without permission.
            </h3>
            <h2 className="text-[12px] text-gray-500">Developed by @Burak Saglik</h2>
          </div>
        </div>
        <div className="flex   justify-end  justify-items-end   items-center">
          <nav className="flex max-w-[300px] hidden md:block   ">
            <ul className="grid grid-cols-3  justify-items-center  space-x-4">
              <li>
                <a className="text-gray-300 text-[15px]" href="https://www.linkedin.com/in/burak-saglik/">
                  <FaLinkedin />
                </a>
              </li>
              <li>
                <a className="text-gray-300 text-[15px]" href="https://github.com/sglkbrk">
                  <FaGithub />
                </a>
              </li>
              <li>
                <a className="text-gray-300 text-[15px]" href="https://www.instagram.com/brksglk/">
                  <FaInstagram />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
