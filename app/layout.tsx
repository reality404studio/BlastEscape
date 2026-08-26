import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  // Social previews resolve relative image paths against this. Without it Next
  // falls back to localhost and the shared card renders nothing.
  metadataBase: new URL('https://blast-escape.reality404studio.workers.dev'),
  title: 'Blast Escape — Outbound Directive',
  description: 'A tiny industrial robot cannot jump. The abandoned factory still expects it to reach outbound.',
  openGraph: {
    title: 'Blast Escape — Outbound Directive',
    description: 'A tiny industrial robot cannot jump. The abandoned factory still expects it to reach outbound.',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'Blast Escape key art' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blast Escape — Outbound Directive',
    description: 'A tiny industrial robot cannot jump. The abandoned factory still expects it to reach outbound.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
