import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Header } from '@/components/Header';
import { Suspense } from 'react';

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja' className={`${noto.variable}`}>
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
          {children}
        </Suspense>
      </body>
    </html>
  );
}
