import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Burak Sağlık - Fotoğrafçı & Yazılımcı Portfolyosu',
  description:
    "Burak Sağlık'ın fotoğrafçılık ve yazılım portfolyosunu keşfedin. Burak Saglik tarafından çekilmiş yüksek çözünürlüklü fotoğraflar ve projeler hakkında detaylı bilgiler. Profesyonel fotoğrafçı ve yazılımcı Burak Sağlık ile iletişime geçin.",
  keywords: [
    'Burak Sağlık',
    'Burak Saglik',
    'fotoğrafçı',
    'fotoğrafçılık',
    'yazılımcı',
    'portfolyo',
    'web geliştirme',
    'mobil uygulama',
    'SAP Fiori'
  ],
  openGraph: {
    title: 'Burak Sağlık - Fotoğrafçı & Yazılımcı Portfolyosu',
    description:
      "Burak Sağlık'ın fotoğrafçılık ve yazılım portfolyosunu keşfedin. Burak Saglik tarafından çekilmiş yüksek çözünürlüklü fotoğraflar ve projeler hakkında detaylı bilgiler. Profesyonel fotoğrafçı ve yazılımcı Burak Sağlık ile iletişime geçin.",
    url: 'https://buraksaglik.com/about',
    siteName: 'Burak Sağlık Portfolyo',
    images: [
      {
        url: 'https://api.buraksaglik.com/api/MinioFile/download/588fc047-34ca-458c-9f8b-bf8839227162.jpeg',
        width: 1000,
        height: 1000,
        alt: 'Burak Sağlık Portfolyo'
      }
    ],
    locale: 'tr_TR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Burak Sağlık - Fotoğrafçı & Yazılımcı Portfolyosu',
    description:
      "Burak Sağlık'ın fotoğrafçılık ve yazılım portfolyosunu keşfedin. Burak Saglik tarafından çekilmiş yüksek çözünürlüklü fotoğraflar ve projeler hakkında detaylı bilgiler. Profesyonel fotoğrafçı ve yazılımcı Burak Sağlık ile iletişime geçin.",
    images: ['https://api.buraksaglik.com/api/MinioFile/download/588fc047-34ca-458c-9f8b-bf8839227162.jpeg']
  }
};
export default function Aboutme() {
  return (
    <div className="h-screen  overflow-y-auto md:overflow-hidden  ">
      <div id="scroll" className="relative w-full    h-full flex items-center justify-center  mb-8 mt-24 ">
        <Image
          width={1000}
          height={1000}
          alt="Burak Sağlık - Fotoğrafçı ve Yazılımcı"
          src="https://api.buraksaglik.com/api/MinioFile/download/588fc047-34ca-458c-9f8b-bf8839227162.jpeg"
          className="object-cover  object-center w-full h-full blur-sm"
        />
        <div className="items-center  justify-center absolute z-10 mt-16 sm:mt-0 bg-black  left-2 right-2 md:left-8 md:right-8  space-y-4  ">
          <div className="grid md:grid-cols-12 grid-cols-1 ">
            <div className=" md:col-span-10 p-6 ">
              <div className="grid  grid-cols-2  md:grid-cols-4 gap-x-20   mr-0  md:mr-20  ">
                <div>
                  <p className="text-white text-[14px] font-bold">İsim</p>
                  <h1 className="text-gray-400 text-[13px] ">Burak Sağlık</h1>
                </div>
                <div>
                  <p className="text-white text-[14px] font-bold">Unvan</p>
                  <h2 className="text-gray-400 text-[13px] ">Yazılım Geliştirici & Fotoğrafçı</h2>
                </div>
                <div>
                  <p className="text-white text-[14px] font-bold">Doğum Tarihi</p>
                  <p className="text-gray-400 text-[13px]">02.05.1996</p>
                </div>
                <div>
                  <p className="text-white text-[14px] font-bold">Konum</p>
                  <p className="text-gray-400 text-[13px]">İstanbul</p>
                </div>
              </div>
              <h2 className="text-gray-400 text-[13px]   mt-10 mr-0 sm:mr-8 font-extralight tracking-3">Merhaba, Ben Burak Sağlık</h2>
              <p className="text-gray-400 text-[13px] mt-3 font-extralight mr-0 sm:mr-8 tracking-3">
                Burak Sağlık olarak, 2018 yılında Sivas Cumhuriyet Üniversitesi Yönetim Bilişim Sistemleri bölümünden birincilikle mezun
                oldum. Kariyerime 2016 yılında Detaysoft&apos;ta Web ve Mobil Geliştirici olarak başladım. Bu süre zarfında Frontend
                Developer, Mobile Developer ve SAP Fiori Developer olarak hem web hem de mobil projelerde deneyim kazandım. React.js ve
                Vue.js gibi modern teknolojiler kullanarak dinamik uygulamalar geliştiriyor, aynı zamanda SAP Fiori ile kurumsal çözümler
                oluşturuyorum. Profesyonel kariyerime şu anda Innova&apos;da devam ediyorum ve teknolojik gelişmeleri takip ederek
                projelerime değer katmayı hedefliyorum. Burak Sağlık olarak, yazılım geliştirme ve fotoğrafçılık alanlarında kendimi sürekli
                geliştiriyorum.
              </p>
              <div className="flex flex-row items-center  mt-10 mr-8 justify-between">
                <a href="mailto:sglk.brk@gmail.com" className="text-white text-[13px] font-extralight tracking-3">
                  sglk.brk@gmail.com
                </a>
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
            <div className=" md:col-span-2  h-full flex flex-1 justify-center items-center">
              <div className="md:col-span-2 mt-2 md:mt-0 justify-items-end w-full h-96 md:h-60 relative">
                <Image
                  src="https://buraksaglik.com/assets/images/banner/IMG_0419.jpeg"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  alt="Burak Sağlık Portfolyo - Fotoğrafçı ve Yazılımcı"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
