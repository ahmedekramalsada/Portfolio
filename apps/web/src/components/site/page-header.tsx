/**
 * The shared opening block for every inner page: a small label, a large title,
 * and an optional line of explanation. Keeps page rhythm identical everywhere.
 */
export function PageHeader({
  label,
  title,
  lede,
  children,
}: {
  label: string;
  title: React.ReactNode;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-12">
      <span className="label">{label}</span>
      <h1 className="h1 mt-5 max-w-[26ch]">{title}</h1>
      {lede && <p className="lede">{lede}</p>}
      {children}
    </header>
  );
}
