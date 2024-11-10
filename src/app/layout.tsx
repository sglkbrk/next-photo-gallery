import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

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
  title: 'BsGallery',
  description: 'My Gallery'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}  bg-black min-h-screen w-full h-full md:pl-12 md:pr-12`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
