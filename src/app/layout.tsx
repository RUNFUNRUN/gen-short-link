import { Header } from '@/components/header';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const geist = Geist({
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GenShort.Link',
  description: 'generate short link',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={`${geist.className} ${geistMono.variable} antialiased mx-2`}
      >
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
