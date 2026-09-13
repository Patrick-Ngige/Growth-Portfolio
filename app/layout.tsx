import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Header from '@/components/navigation/Header';
import Footer from '@/components/sections/Footer';
import Loader from '@/components/motion/Loader';
import './globals.css';
import { metadata as siteMetadata, jsonLd } from './metadata';

// Font configurations - Using Space Grotesk as a free alternative to Clash Display
const clashDisplay = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF6ED' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0C10' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  ...siteMetadata,
  metadataBase: new URL('https://patrick-growth.com'),
  alternates: {
    canonical: 'https://patrick-growth.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${clashDisplay.variable} ${inter.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body
        className={`
          min-h-screen
          bg-[var(--background-primary)]
          text-[var(--text-primary)]
          font-body
          antialiased
          selection:bg-accent-growth selection:text-[var(--background-primary)]
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Loader />
          <Header />
          <main id="main-content" className="relative" role="main">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
