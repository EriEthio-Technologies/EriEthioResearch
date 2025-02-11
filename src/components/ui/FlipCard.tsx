"use client"

import { motion } from 'framer-motion';
import { useState } from 'react';

interface FlipCardProps {
  title: string;
  subtitle?: string;
  summary: string;
  tags?: string[];
  imageUrl?: string;
  gradient?: {
    from: string;
    to: string;
  };
  onClick?: () => void;
}

export function FlipCard({
  title,
  subtitle,
  summary,
  tags,
  imageUrl,
  gradient = {
    from: '#1cc2ff',
    to: '#ff261b'
  },
  onClick
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="flip-card-container"
      initial={false}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
      onClick={onClick}
      style={{
        width: '300px',
        height: '400px',
        perspective: '1000px',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <div className="relative w-full h-full">
        {/* Front of card */}
        <motion.div
          className={`absolute inset-0 w-full h-full rounded-xl p-6 ${
            isFlipped ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-300`}
          style={{
            backgroundColor: 'rgb(0, 0, 0)',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="relative w-full h-full flex flex-col justify-between">
            {/* Background gradient effect */}
            <div
              className="absolute inset-0 -left-[5px] m-auto w-[310px] h-[410px] rounded-xl -z-10"
              style={{
                background: `linear-gradient(-45deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
                transform: isFlipped ? 'rotate(-90deg) scaleX(1.34) scaleY(0.77)' : 'none',
                transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
            />
            
            {/* Blur effect */}
            <div
              className="absolute inset-0 -z-1"
              style={{
                background: `linear-gradient(-45deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
                transform: 'scale(0.95)',
                filter: isFlipped ? 'blur(50px)' : 'blur(40px)',
                transition: 'filter 0.6s ease',
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              {imageUrl && (
                <div 
                  className="w-full h-48 rounded-lg mb-4 bg-cover bg-center"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
              {subtitle && (
                <p className="text-gray-300 mb-4">{subtitle}</p>
              )}
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-sm bg-neon-cyan/10 text-neon-cyan rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className={`absolute inset-0 w-full h-full rounded-xl p-6 ${
            isFlipped ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
          style={{
            backgroundColor: 'rgb(0, 0, 0)',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="relative w-full h-full flex flex-col justify-center">
            {/* Background gradient effect */}
            <div
              className="absolute inset-0 -left-[5px] m-auto w-[310px] h-[410px] rounded-xl -z-10"
              style={{
                background: `linear-gradient(-45deg, ${gradient.to} 0%, ${gradient.from} 100%)`,
              }}
            />
            
            {/* Blur effect */}
            <div
              className="absolute inset-0 -z-1"
              style={{
                background: `linear-gradient(-45deg, ${gradient.to} 0%, ${gradient.from} 100%)`,
                transform: 'scale(0.95)',
                filter: 'blur(40px)',
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              <p className="text-white text-lg leading-relaxed">{summary}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

