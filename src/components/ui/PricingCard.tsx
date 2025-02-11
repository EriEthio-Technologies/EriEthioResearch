'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: number;
  period?: string;
  features: string[];
  isPopular?: boolean;
  gradient?: {
    from: string;
    to: string;
  };
  onClick?: () => void;
}

export function PricingCard({
  title,
  price,
  period = 'month',
  features,
  isPopular = false,
  gradient = {
    from: '#0a3cff',
    to: '#0a3cff'
  },
  onClick
}: PricingCardProps) {
  return (
    <motion.div
      className="relative w-[320px] p-[2px] rounded-3xl overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.48, ease: [0.23, 1, 0.32, 1] }}
      onClick={onClick}
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 w-[160%] h-[160%] -z-10"
        style={{
          background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
          animation: 'moving 4.8s linear infinite paused',
        }}
      />

      {/* Card content */}
      <div className="relative flex flex-col gap-6 p-8 rounded-[22px] bg-black/90 backdrop-blur-xl">
        {isPopular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon-magenta text-white text-sm rounded-full">
            Most Popular
          </div>
        )}

        <div className="space-y-1 text-center">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-neon-cyan">${price}</span>
            <span className="text-gray-400">/{period}</span>
          </div>
        </div>

        <ul className="space-y-4">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-3 text-gray-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Check className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>

        <motion.button
          className="w-full py-3 text-center text-black font-semibold rounded-lg transition-colors"
          style={{
            background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
          }}
          whileHover={{ opacity: 0.9 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </div>

      <style jsx>{`
        @keyframes moving {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        div:hover > div:first-child {
          animation-play-state: running;
          width: 20%;
        }
      `}</style>
    </motion.div>
  );
}

