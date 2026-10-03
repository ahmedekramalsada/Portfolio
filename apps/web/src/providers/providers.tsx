export function Providers({ children }: { children: React.ReactNode }) {
  // The site has one dark theme and uses fetch, not React Query. Keep this
  // composition point without shipping unused providers to every visitor.
  return children;
}
