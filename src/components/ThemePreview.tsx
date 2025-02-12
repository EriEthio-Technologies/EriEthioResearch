'use client';

import { motion } from 'framer-motion';
import { Theme } from '@/types/theme';
import { getAnimationVariants } from '@/lib/animations';

interface ThemePreviewProps {
  theme: Theme;
  onSelect?: () => void;
}

export function ThemePreview({ theme, onSelect }: ThemePreviewProps) {
  const buttonVariants = getAnimationVariants('button', theme.animations.buttons.preset);
  const cardVariants = getAnimationVariants('card', theme.animations.cards.preset, theme.animations.cards.direction);

  return (
    <motion.div
      className="p-6 rounded-lg"
      style={{
        background: theme.colors.background,
        color: theme.colors.text,
        border: `1px solid ${theme.colors.border}`,
        fontFamily: theme.fonts.body
      }}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Theme Name */}
      <h3 
        className="text-xl mb-4"
        style={{ 
          fontFamily: theme.fonts.heading,
          color: theme.colors.primary
        }}
      >
        {theme.name}
      </h3>

      {/* Color Swatches */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {Object.entries(theme.colors).map(([name, color]) => (
          <div
            key={name}
            className="aspect-square rounded-md"
            style={{ backgroundColor: color }}
            title={name}
          />
        ))}
      </div>

      {/* Sample Button */}
      <motion.button
        className="w-full py-2 px-4 rounded-md mb-4"
        style={{
          backgroundColor: theme.colors.primary,
          color: theme.colors.background,
          fontFamily: theme.fonts.body,
          borderRadius: theme.borderRadius.md
        }}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        Sample Button
      </motion.button>

      {/* Sample Card */}
      <motion.div
        className="p-4 rounded-md"
        style={{
          backgroundColor: theme.colors.surface || theme.colors.background,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.lg
        }}
        variants={cardVariants}
        whileHover="hover"
      >
        <h4 
          style={{ 
            color: theme.colors.primary,
            fontFamily: theme.fonts.heading
          }}
          className="text-lg mb-2"
        >
          Card Title
        </h4>
        <p 
          style={{ color: theme.colors.muted }}
          className="text-sm"
        >
          Sample card content with theme styling
        </p>
      </motion.div>

      {/* Typography Sample */}
      <div className="mt-4 space-y-2">
        <h5 
          style={{ 
            fontFamily: theme.fonts.heading,
            color: theme.colors.secondary
          }}
          className="text-sm font-semibold"
        >
          Typography
        </h5>
        <div 
          style={{ 
            fontFamily: theme.fonts.body,
            color: theme.colors.text
          }}
          className="text-xs"
        >
          Body Text Sample
        </div>
        {theme.fonts.mono && (
          <div 
            style={{ 
              fontFamily: theme.fonts.mono,
              color: theme.colors.muted
            }}
            className="text-xs"
          >
            Monospace Text
          </div>
        )}
      </div>

      {/* Effects Preview */}
      {theme.effects && (
        <div className="mt-4 space-y-2">
          {/* Shadows */}
          {theme.effects.shadows && (
            <div className="flex gap-2">
              {Object.entries(theme.effects.shadows).map(([size, shadow]) => (
                <div
                  key={size}
                  className="w-8 h-8 rounded-md"
                  style={{
                    backgroundColor: theme.colors.surface || theme.colors.background,
                    boxShadow: shadow
                  }}
                />
              ))}
            </div>
          )}

          {/* Glassmorphism */}
          {theme.effects.glassmorphism && (
            <div
              className="p-2 rounded-md"
              style={{
                backgroundColor: `${theme.colors.background}${Math.round(theme.effects.glassmorphism.opacity * 255).toString(16).padStart(2, '0')}`,
                backdropFilter: `blur(${theme.effects.glassmorphism.blur})`,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              <span className="text-xs">Glassmorphism Effect</span>
            </div>
          )}

          {/* Gradients */}
          {theme.effects.gradients && (
            <div
              className="h-8 rounded-md"
              style={{
                background: `linear-gradient(${theme.effects.gradients.primary.direction || '90deg'}, ${theme.effects.gradients.primary.from}, ${theme.effects.gradients.primary.to})`
              }}
            />
          )}
        </div>
      )}
    </motion.div>
  );
} 