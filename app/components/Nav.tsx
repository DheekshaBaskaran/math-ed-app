'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Practice' },
  { href: '/tutor', label: 'AI Tutor' },
];

export default function Nav() {
  const path = usePathname();

  return (
    <header className="nav">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="logo-mark font-display">∑</span>
          <span className="font-display text-lg font-bold tracking-tight">MathEd</span>
        </Link>
        <div className="flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link"
              aria-current={path === l.href ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
