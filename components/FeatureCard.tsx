import Link from 'next/link';

export function FeatureCard({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="card">
      <h3>{title} ?</h3>
      <p>{children}</p>
    </Link>
  );
}
