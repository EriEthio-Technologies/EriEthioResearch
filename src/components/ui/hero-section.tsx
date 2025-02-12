'use client';

import { motion } from 'framer-motion';

interface Button {
  text: string;
  href: string;
  variant: 'primary' | 'secondary';
}

interface HeroSectionProps {
  title: string;
  subtitle: string;
  buttons?: Button[];
  align?: 'left' | 'center' | 'right';
  background?: 'gradient' | 'image' | 'video';
  backgroundUrl?: string;
}

export function HeroSection({
  title = "EriEthio Research",
  subtitle = "Advancing Research & Innovation",
  buttons = [
    { text: "Explore Research", href: "/research", variant: "primary" },
    { text: "View Projects", href: "/projects", variant: "secondary" }
  ],
  align = "center",
  background = "gradient",
  backgroundUrl
}: HeroSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`text-${align} space-y-8 relative`}
    >
      {background === 'image' && backgroundUrl && (
        <>
          <div
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: `url(${backgroundUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.5)'
            }}
          />
          <div className="absolute inset-0 bg-black/50 -z-10" />
        </>
      )}

      <motion.h1 
        className="text-6xl font-bold text-neon-cyan"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h1>

      <motion.p 
        className="text-2xl text-neon-magenta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {subtitle}
      </motion.p>

      <motion.div 
        className={`flex ${align === 'center' ? 'justify-center' : ''} flex-col md:flex-row gap-4 mt-8`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {buttons.map((button, index) => (
          <motion.a
            key={index}
            href={button.href}
            className={`px-8 py-3 rounded-lg transition-colors ${
              button.variant === 'primary'
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan hover:bg-neon-cyan/30'
                : 'bg-neon-magenta/20 text-neon-magenta border border-neon-magenta hover:bg-neon-magenta/30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {button.text}
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  );
} 