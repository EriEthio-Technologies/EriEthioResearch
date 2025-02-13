'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/research', label: 'Research' },
    { href: '/publications', label: 'Publications' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-black/30 backdrop-blur-sm border-b border-neon-cyan/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-neon-cyan">
              EriEthio Research
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-neon-cyan transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center gap-4">
                {session.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-neon-magenta hover:text-neon-magenta/80 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                >
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => signIn()}
                  className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => signIn()}
                  className="bg-neon-cyan/20 text-neon-cyan border border-neon-cyan hover:bg-neon-cyan hover:text-black transition-all"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-neon-cyan transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-neon-cyan/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-gray-300 hover:text-neon-cyan transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                {session.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 text-neon-magenta hover:text-neon-magenta/80 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    signIn();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    signIn();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-neon-magenta hover:text-neon-magenta/80 transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 