"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flip-card-container"
      initial={false}
      animate={{ 
        rotateY: isFlipped ? 180 : 0,
        scale: isHovered ? 1.05 : 1
      }}
      transition={{ 
        duration: 0.6, 
        ease: "easeInOut",
        scale: {
          duration: 0.3,
          ease: "easeOut"
        }
      }}
      onHoverStart={() => {
        setIsHovered(true);
        setIsFlipped(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        setIsFlipped(false);
      }}
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
                filter: isFlipped ? 'blur(50px)' : 'blur(20px)',
                transition: 'filter 0.6s ease',
                opacity: 0.7,
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              {imageUrl && (
                <motion.div 
                  className="w-full h-48 rounded-lg mb-4 bg-cover bg-center overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="w-full h-full"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                </motion.div>
              )}
              <motion.h3 
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h3>
              {subtitle && (
                <motion.p 
                  className="text-gray-300 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {subtitle}
                </motion.p>
              )}
              {tags && tags.length > 0 && (
                <motion.div 
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      className="px-2 py-1 text-sm bg-black/30 border border-neon-cyan/30 text-neon-cyan rounded-full"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Click indicator */}
            <AnimatePresence>
              {isHovered && onClick && (
                <motion.div
                  className="absolute bottom-4 right-4 flex items-center gap-2 text-neon-cyan"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <span className="text-sm">Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
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
                filter: 'blur(20px)',
                opacity: 0.7,
              }}
            />

            {/* Content */}
            <motion.div 
              className="relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 20 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-white text-lg leading-relaxed">{summary}</p>
              
              {onClick && (
                <motion.button
                  className="mt-6 px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white text-sm flex items-center gap-2 hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

