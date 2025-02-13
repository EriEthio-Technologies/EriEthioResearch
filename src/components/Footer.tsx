'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { NewsletterSignup } from '@/components/NewsletterSignup';

const footerLinks = {
  research: [
    { name: 'Research Hub', href: '/research' },
    { name: 'Publications', href: '/publications' },
    { name: 'Active Projects', href: '/research/active-projects' },
    { name: 'Collaborations', href: '/research/collaborations' },
    { name: 'Ethics', href: '/research/ethics' },
  ],
  products: [
    { name: 'All Products', href: '/products' },
    { name: 'AI Solutions', href: '/products/ai' },
    { name: 'Analytics', href: '/products/analytics' },
    { name: 'Consulting', href: '/products/consulting' },
  ],
  education: [
    { name: 'Courses', href: '/education' },
    { name: 'Workshops', href: '/education/workshops' },
    { name: 'Resources', href: '/education/resources' },
    { name: 'Certification', href: '/education/certification' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/EriEthio-Technologies' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/EriEthioTech' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/eriethio' },
  { name: 'Email', icon: Mail, href: 'mailto:contact@eriethio.com' },
];

export default function Footer() {
  return (
    <footer className="bg-black/50 backdrop-blur-md border-t border-neon-cyan/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neon-cyan mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-6 max-w-2xl">
            Subscribe to our newsletter for the latest research insights, product updates, and collaboration opportunities.
          </p>
          <NewsletterSignup />
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
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

        {/* Bottom Section */}
        <div className="border-t border-neon-cyan/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo and Copyright */}
            <div className="mb-4 md:mb-0">
              <Link href="/" className="text-neon-cyan font-bold text-xl mb-2 block">
                EriEthio Research
              </Link>
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} EriEthio Research. All rights reserved.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-6">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-neon-magenta transition-colors"
                    aria-label={link.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 