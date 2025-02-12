'use client';

import { useEffect } from 'react';
import type { Theme } from '@/components/ui/theme-picker';

export function useTheme(theme: Theme) {
  useEffect(() => {
    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });

    // Apply fonts
    document.documentElement.style.setProperty('--font-heading', theme.fonts.heading);
    document.documentElement.style.setProperty('--font-body', theme.fonts.body);

    // Apply spacing
    document.documentElement.style.setProperty('--spacing-base', `${theme.spacing.base}px`);
    document.documentElement.style.setProperty('--spacing-scale', theme.spacing.scale.toString());

    // Apply border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--radius-${key}`, value);
    });

    // Generate spacing scale
    const scale = theme.spacing.scale;
    const base = theme.spacing.base;
    for (let i = 0; i <= 12; i++) {
      const value = Math.round(base * Math.pow(scale, i));
      document.documentElement.style.setProperty(`--space-${i}`, `${value}px`);
    }

    // Add theme class to body
    document.body.className = `theme-${theme.name.toLowerCase().replace(/\s+/g, '-')}`;

    // Clean up function
    return () => {
      // Remove theme variables
      Object.keys(theme.colors).forEach((key) => {
        document.documentElement.style.removeProperty(`--color-${key}`);
      });
      document.documentElement.style.removeProperty('--font-heading');
      document.documentElement.style.removeProperty('--font-body');
      document.documentElement.style.removeProperty('--spacing-base');
      document.documentElement.style.removeProperty('--spacing-scale');
      Object.keys(theme.borderRadius).forEach((key) => {
        document.documentElement.style.removeProperty(`--radius-${key}`);
      });
      for (let i = 0; i <= 12; i++) {
        document.documentElement.style.removeProperty(`--space-${i}`);
      }
      document.body.className = '';
    };
  }, [theme]);
} 