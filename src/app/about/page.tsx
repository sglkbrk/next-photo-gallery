import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
export default function Aboutme() {
  return (
    <div className="h-screen w-full ">
      <div id="scroll" className="relative w-full  overflow-hidden   h-full flex items-center justify-center  mb-8 mt-8 ">
        <img
          src="https://www.codesymbol.com/templates/uno/demo/dark/images/f14.jpg"
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
                  <p className="text-white text-[13px] ">Photographer</p>
                </div>
                <div>
                  <p className="text-white text-[14px] font-bold">Type</p>
                  <p className="text-white text-[13px]">Freelancer</p>
                </div>
                <div>
                  <p className="text-white text-[14px] font-bold">Place</p>
                  <p className="text-white text-[13px]">Istanbul</p>
                </div>
              </div>
              <p className="text-gray-400 text-[13px]   mt-10 font-extralight tracking-3">
                VVestibulum tellus risus, pretium et facilisis nec, porta in felis. Nullam fermentum, lorem nec tincidunt tempus, lectus
                venenatis nisi, quis ultrices tortor arcu id diam. Nunc eros est.
              </p>
              <p className="text-gray-400 text-[13px] mt-10 font-extralight tracking-3">
                VVestibulum tellus risus, pretium et facilisis nec, porta in felis. Nullam fermentum, lorem nec tincidunt tempus, lectus
                venenatis nisi, quis ultrices tortor arcu id diam. Nunc eros est.
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
