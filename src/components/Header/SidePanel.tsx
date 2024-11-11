import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function SidePanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50 ">
      {/* Toggle Button */}
      <FaBars onClick={() => setIsOpen(!isOpen)} />

      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-black bg-opacity-80 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel İçeriği */}
        <div className="p-4">
          <div className="flex justify-end m-2">
            <FaTimes className="text-white text-2xl" onClick={() => setIsOpen(false)} />
          </div>
          <nav className="mt-4 space-y-4 justify-center">
            <Link href="/" onClick={() => setIsOpen(false)} className="block text-gray-300  hover:underline">
              Home
            </Link>
            <Link href="/post" onClick={() => setIsOpen(false)} className="block text-gray-300  hover:underline">
              Post
            </Link>
            <Link href="/gallery" onClick={() => setIsOpen(false)} className="block text-gray-300  hover:underline">
              Galery
            </Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="block text-gray-300  hover:underline">
              About
            </Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="block text-gray-300  hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </div>

      {/* Sağ Yarıya Sınırlandırılmış Overlay */}
      {/* {isOpen && <div className="fixed top-0 right-0 h-full w-1/2 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>} */}
    </div>
  );
}
