import { localePath, otherLocalePath, type Locale } from './site-content';
import { UI } from './ui-copy';

export type LocalizedSite = typeof UI.en;

export function getLocale(pathname: string): Locale {
  return pathname === '/ar' || pathname.startsWith('/ar/') ? 'ar' : 'en';
}

export function pathFor(locale: Locale, path: string): string {
  return localePath(locale, path);
}

export function switchPath(locale: Locale, pathname: string): string {
  return otherLocalePath(locale, pathname);
}

export function copyFor(locale: Locale): LocalizedSite {
  return UI[locale];
}
