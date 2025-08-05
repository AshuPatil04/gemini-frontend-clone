
'use client';

import { Toaster } from 'react-hot-toast';
import { useThemeStore } from '@/store/themeStore';
import  './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const dark = useThemeStore((s) => s.dark);

  return (
    <html lang="en">
      <body className={dark ? 'dark-mode' : ''}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
