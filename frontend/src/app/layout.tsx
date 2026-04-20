import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { OpeningAnimation } from '@/components/OpeningAnimation';

const noto = localFont({
  src: './fonts/NotoSansJP-VariableFont_wght.woff2',
  variable: '--font-noto-sans-jp',
  display: 'swap',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Moments',
  description:
    '【Next.js 13 × Unsplash API】モダンな技術スタックで構築した、Instagramライクな写真共有アプリケーション',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Moments',
    description:
      '【Next.js 13 × Unsplash API】モダンな技術スタックで構築した、Instagramライクな写真共有アプリケーション',
    url: 'https://moments.vector-n.net/',
    siteName: 'Moments',
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja' className={`${noto.variable}`}>
      <body>
        <OpeningAnimation />
        <Suspense
          fallback={
            <div className='fixed inset-0 flex items-center justify-center bg-white'>
              <Loader2 className='h-10 w-10 animate-spin text-gray-500' />
            </div>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
