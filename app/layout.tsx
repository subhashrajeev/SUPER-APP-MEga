import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'IVR INTERIORS - Premium Interior Design & Modular Solutions',
    template: '%s | IVR INTERIORS',
  },
  description: 'Transform your spaces with IVR INTERIORS - Leading provider of modular kitchens, wardrobes, and complete interior design solutions in Hyderabad. Expert craftsmanship, premium materials, and innovative designs.',
  keywords: [
    'interior design',
    'modular kitchen',
    'wardrobe design',
    'home interiors',
    'office interiors',
    'Hyderabad interiors',
    'kitchen cabinets',
    'custom furniture',
    'IVR Interiors',
  ],
  authors: [{ name: 'IVR INTERIORS' }],
  creator: 'IVR INTERIORS',
  publisher: 'IVR INTERIORS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    title: 'IVR INTERIORS - Premium Interior Design & Modular Solutions',
    description: 'Transform your spaces with expert interior design, modular kitchens, and custom furniture solutions.',
    siteName: 'IVR INTERIORS',
    images: [
      {
        url: '/images/ivr-visiting-card.jpg',
        width: 1200,
        height: 630,
        alt: 'IVR INTERIORS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IVR INTERIORS - Premium Interior Design',
    description: 'Transform your spaces with expert interior design and modular solutions.',
    images: ['/images/ivr-visiting-card.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.variable}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
