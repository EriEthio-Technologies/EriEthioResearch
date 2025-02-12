'use client';

import { useEffect, useCallback } from 'react';
import type { Theme } from '@/components/ui/theme-picker';

export function useTheme(theme: Theme, isPreview: boolean = false) {
  const applyTheme = useCallback((theme: Theme, prefix: string = '') => {
    // Apply colors with optional prefix for preview
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`${prefix}--color-${key}`, value);
    });

    if (!prefix) { // Only apply non-color properties for actual theme (not preview)
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

      // Add CSS variables for transitions
      document.documentElement.style.setProperty('--theme-transition', '0.3s ease-in-out');
      document.documentElement.style.setProperty('--theme-transition-property', 'background-color, color, border-color');
    }
  }, []);

  const removeTheme = useCallback((prefix: string = '') => {
    // Remove color variables
    const styleSheet = document.documentElement.style;
    for (let i = 0; i < styleSheet.length; i++) {
      const property = styleSheet[i];
      if (property.startsWith(`${prefix}--color-`)) {
        document.documentElement.style.removeProperty(property);
      }
    }

    if (!prefix) { // Only remove non-color properties for actual theme
      // Remove other theme properties
      document.documentElement.style.removeProperty('--font-heading');
      document.documentElement.style.removeProperty('--font-body');
      document.documentElement.style.removeProperty('--spacing-base');
      document.documentElement.style.removeProperty('--spacing-scale');
      
      // Remove border radius
      ['sm', 'md', 'lg'].forEach(size => {
        document.documentElement.style.removeProperty(`--radius-${size}`);
      });

      // Remove spacing scale
      for (let i = 0; i <= 12; i++) {
        document.documentElement.style.removeProperty(`--space-${i}`);
      }

      // Remove theme class
      document.body.className = '';

      // Remove transition variables
      document.documentElement.style.removeProperty('--theme-transition');
      document.documentElement.style.removeProperty('--theme-transition-property');
    }
  }, []);

  useEffect(() => {
    const prefix = isPreview ? 'preview-' : '';
    applyTheme(theme, prefix);

    // If this is a preview, remove it after a delay
    let timeoutId: NodeJS.Timeout;
    if (isPreview) {
      timeoutId = setTimeout(() => {
        removeTheme(prefix);
      }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      removeTheme(prefix);
    };
  }, [theme, isPreview, applyTheme, removeTheme]);

  return {
    applyTheme,
    removeTheme
  };
} 