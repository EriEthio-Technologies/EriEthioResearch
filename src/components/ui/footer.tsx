'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

const footerLinks = {
  research: [
    { name: 'Projects', href: '/research' },
    { name: 'Publications', href: '/research/publications' },
    { name: 'Methodology', href: '/research/methodology' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'License', href: '/license' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black/50 backdrop-blur-md border-t border-neon-cyan/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-neon-cyan font-bold text-xl">EriEthio Research</h2>
            <p className="text-gray-400 text-sm">
              Advancing research and innovation through collaboration and excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-neon-magenta">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-magenta">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-magenta">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-neon-magenta font-semibold uppercase mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-neon-cyan transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-neon-cyan/20">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} EriEthio Research. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 