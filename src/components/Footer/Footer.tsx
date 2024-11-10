import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
export default function Footer() {
  return (
    <footer className="md:pl-0  pl-10 ">
      <div className="flex items-center h-16 md:h-20 sm:h-16  ">
        <div className="flex-1 justify-items-center align-items-center">
          <a href="https://buraksaglik.com" className="text-gray-700 text-[12px]">
            @Burak Sağlık
          </a>
        </div>
        <div className="flex justify-items-end   items-center">
          <nav className="flex-1 max-w-[300px]  hidden md:block   ">
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
