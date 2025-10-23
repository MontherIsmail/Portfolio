import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Monther Alzamli - Full Stack Developer',
  description:
    "Modern portfolio showcasing Monther Alzamli's skills, projects, and experience in web and mobile development.",
  keywords: [
    'Monther Alzamli',
    'Full Stack Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Portfolio',
  ],
  authors: [{ name: 'Monther Alzamli' }],
  creator: 'Monther Alzamli',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://montheralzamli.com',
    title: 'Monther Alzamli - Full Stack Developer',
    description:
      "Modern portfolio showcasing Monther Alzamli's skills, projects, and experience in web and mobile development.",
    siteName: 'Monther Alzamli Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monther Alzamli - Full Stack Developer',
    description:
      "Modern portfolio showcasing Monther Alzamli's skills, projects, and experience in web and mobile development.",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className={`${inter.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>{children}</AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </body>
    </html>
  );
}
