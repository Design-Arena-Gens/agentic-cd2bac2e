"use client";
import Link from 'next/link';

export function Nav() {
  return (
    <nav className="links">
      <Link href="/resume">Resume Analyzer</Link>
      <Link href="/learning">Learning Paths</Link>
      <Link href="/jobs">Job Matcher</Link>
      <Link href="/interview">Interview Prep</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
}
