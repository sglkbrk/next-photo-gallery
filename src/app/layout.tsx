import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Head from 'next/head';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
});

export const metadata: Metadata = {
  title: 'Burak Sağlık | BsGallery',
  metadataBase: new URL('https://gallery.buraksaglik.com'),
  alternates: {
    canonical: '/'
  },
  authors: [{ name: 'Burak Sağlık', url: 'https://github.com/sglkbrk' }],
  description: "Burak Sağlık's gallery website",
  openGraph: {
    title: 'Burak Sağlık | BsGallery',
    description: "Burak Sağlık's gallery website",
    images: [
      {
        url: '/screenshot.png',
        alt: "Burak Sağlık's Gallery Website",
        width: 640,
        height: 800
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <meta property="og:title" content="BsGallery" />
        <meta
          property="og:description"
          content="Discover high-resolution photographs and in-depth articles from around the world | Dünyanın dört bir yanından yüksek çözünürlüklü fotoğraflar ve detaylı makaleler keşfedin."
        />
        <meta property="og:image" content="https://www.example.com/image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}  bg-black min-h-screen w-full h-full md:pl-12 md:pr-12`}>
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </>
  );
}
