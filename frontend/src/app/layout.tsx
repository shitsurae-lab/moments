import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const noto = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-jp', // Tailwind v4用
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
    <html lang='ja' className={noto.variable}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
