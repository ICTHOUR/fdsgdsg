import type {Metadata, Viewport} from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'মাতৃভূমি টিভি - matrivumi.tv | সত্যের সন্ধানে নির্ভীক সাংবাদিকতা',
  description: 'মাতৃভূমি টিভি (matrivumi.tv) - সত্যের সন্ধানে নির্ভীক সাংবাদিকতা | ২৪ ঘণ্টা লাইভ সংবাদ ও সম্প্রচার, জাতীয়, রাজনীতি, অর্থনীতি, আন্তর্জাতিক ও বিনোদন নিউজ পোর্টাল।',
  openGraph: {
    title: 'মাতৃভূমি টিভি - matrivumi.tv | সত্যের সন্ধানে নির্ভীক সাংবাদিকতা',
    description: 'মাতৃভূমি টিভি (matrivumi.tv) - সত্যের সন্ধানে নির্ভীক সাংবাদিকতা | ২৪ ঘণ্টা লাইভ সংবাদ ও জাতীয় অনলাইন নিউজ পোর্টাল।',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'মাতৃভূমি টিভি - matrivumi.tv',
    description: 'মাতৃভূমি টিভি (matrivumi.tv) - সত্যের সন্ধানে নির্ভীক সাংবাদিকতা',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
