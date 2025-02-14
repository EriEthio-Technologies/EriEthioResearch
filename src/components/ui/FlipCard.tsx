"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Tag } from 'lucide-react';

interface FlipCardProps {
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  gradient: {
    from: string;
    to: string;
  };
  path: string;
  onClick?: () => void;
}

export function FlipCard({ title, subtitle, summary, tags, gradient, path, onClick }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="w-full aspect-[3/4] cursor-pointer perspective-1000"
      onClick={() => {
        setIsFlipped(!isFlipped);
        if (onClick && !isFlipped) onClick();
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full rounded-xl p-6 backface-hidden"
          style={{
            background: `linear-gradient(135deg, ${gradient.from}20, ${gradient.to}20)`,
            border: `1px solid ${gradient.from}40`,
          }}
        >
          <div className="h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ color: gradient.from }}>
                {title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: `${gradient.from}20`,
                    color: gradient.from,
                    border: `1px solid ${gradient.from}40`,
                  }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full rounded-xl p-6 backface-hidden"
          style={{
            background: `linear-gradient(135deg, ${gradient.to}20, ${gradient.from}20)`,
            border: `1px solid ${gradient.to}40`,
            transform: "rotateY(180deg)",
          }}
        >
          <div className="h-full flex flex-col justify-between">
            <p className="text-gray-300 line-clamp-6">{summary}</p>
            <button
              className="mt-4 px-4 py-2 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: `${gradient.to}20`,
                color: gradient.to,
                border: `1px solid ${gradient.to}40`,
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

