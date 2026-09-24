'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function LocaleDocumentSync() {
  const pathname = usePathname() || '/';
  const isArabic = pathname === '/ar' || pathname.startsWith('/ar/');

  useEffect(() => {
    document.documentElement.lang = isArabic ? 'ar-EG' : 'en-US';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }, [isArabic]);

  return null;
}
