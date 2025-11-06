import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Career Accelerator',
  description: 'Personalized AI career development platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="container">
          <div className="nav">
            <Link href="/" className="brand">
              <img src="/logo.svg" alt="logo" width={28} height={28} />
              <span>AI Career Accelerator</span>
            </Link>
            <nav className="links">
              <Link href="/resume">Resume Analyzer</Link>
              <Link href="/learning">Learning Paths</Link>
              <Link href="/jobs">Job Matcher</Link>
              <Link href="/interview">Interview Prep</Link>
              <Link href="/dashboard">Dashboard</Link>
            </nav>
          </div>
        </header>
        <main className="container main">{children}</main>
        <footer className="container footer">
          <span>? {new Date().getFullYear()} AI Career Accelerator</span>
        </footer>
      </body>
    </html>
  );
}
