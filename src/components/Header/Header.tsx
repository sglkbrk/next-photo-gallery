'use client';
import Link from 'next/link';
import DropdownMenu from './SidePanel';
export default function Header() {
  return (
    <header className="md:pl-0  pl-10">
      <div className="flex justify-items-center items-center h-16 md:h-24 sm:h-16">
        <div className="flex-1 justify-items-center align-items-center">
          <Link href="/">
            <p className="text-gray-300">BsGallery</p>
          </Link>
        </div>
        <div className="flex-1 "></div>
        <nav className="flex-1 max-w-[300px] hidden md:block ">
          <ul className="grid grid-cols-5 justify-items-center">
            <li>
              <Link className="text-gray-300  text-[12px]" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="text-gray-300  text-[12px]" href="/post">
                Post
              </Link>
            </li>
            <li>
              <Link className="text-gray-300  text-[12px]" href="/gallery">
                Galery
              </Link>
            </li>
            <li>
              <Link className="text-gray-300  text-[12px]" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="text-gray-300  text-[12px]" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex-2 md:pl-0  pr-10   text-gray-300 block md:hidden">
          {' '}
          <DropdownMenu></DropdownMenu>
        </div>
      </div>
    </header>
  );
}
