import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'BsGallery-Contact',
  description: 'My Gallery-Contact'
};
export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center ml-5 mr-5 xl:ml-72 xl:mr-72 h-screen ">
      <h1 className="text-white text-6xl">Contact Me</h1>
      <p className="text-white text-[13px] mt-12 font-extralight">
        Feel free to get in touch! You can use the contact information below for any questions, suggestions, or collaboration opportunities.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3   w-full gap-4 mt-12 justify-items-center items-center">
        <div>
          <p className="text-white text-[14px] font-extralight tracking-3 w-25">Telefon</p>
          <p className="text-white text-[13px] font-extralight  w-25">---</p>
        </div>
        <div>
          <p className="text-white text-[14px] font-extralight  tracking-3 w-25">Address</p>
          <p className="text-white text-[13px] font-extralight  w-25">Sivas/Merkez</p>
        </div>
        <div>
          <p className="text-white text-[14px] font-extralight  tracking-3 w-25">Email</p>
          <a href="mailto:sglk.brk@gmail.com" className="text-white text-[13px] font-extralight  w-25">
            sglk.brk@gmail.com
          </a>
        </div>
      </div>
      <div className="grid grid-cols-12 w-full mt-12">
        <div className="flex flex-col justify-center items-center space-y-4 w-full col-span-12 sm:col-span-7 ">
          <input
            className="w-full p-3 bg-black border border-gray-500 placeholder:text-gray placeholder:font-extralight placeholder:text-[14px] uppercase  "
            placeholder="Name"
          />
          <input
            className="w-full p-3 bg-black border border-gray-500 placeholder:text-gray placeholder:font-extralight placeholder:text-[14px] uppercase"
            placeholder="email"
          />
          <input
            className="w-full p-3 bg-black border border-gray-500 placeholder:text-gray placeholder:font-extralight placeholder:text-[14px] uppercase"
            placeholder="subject"
          />
          <textarea
            rows={5}
            className="w-full p-3 bg-black border border-gray-500 placeholder:text-gray placeholder:font-extralight placeholder:text-[14px] uppercase"
            placeholder="message"
          />
          <div className="w-full">
            <button className="text-black text-[14px]  bg-white uppercase border border-white p-2 tracking-3 rounded-sm">summit</button>
          </div>
        </div>

        {/* <div className="bg-red-900 w-full  col-span-5">deneme</div> */}
      </div>
    </div>
  );
}
