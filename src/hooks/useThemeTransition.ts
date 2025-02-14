'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Theme, ThemePreview, ThemeTransition } from '@/types/theme';

export function useThemeTransition(currentTheme: Theme) {
  const [preview, setPreview] = useState<ThemePreview | null>(null);
  const [transition, setTransition] = useState<ThemeTransition | null>(null);

  const interpolateColor = useCallback((from: string, to: string, progress: number) => {
    const fromRGB = from.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
    const toRGB = to.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
    
    const result = fromRGB.map((from, i) => {
      const to = toRGB[i];
      const value = Math.round(from + (to - from) * progress);
      return value.toString(16).padStart(2, '0');
    }).join('');

    return `#${result}`;
  }, []);

  const interpolateTheme = useCallback((from: Theme, to: Theme, progress: number): Theme => {
    return {
      ...to,
      colors: Object.keys(to.colors).reduce((acc, key) => ({
        ...acc,
        [key]: interpolateColor(
          from.colors[key as keyof typeof from.colors] || '#000000',
          to.colors[key as keyof typeof to.colors] || '#000000',
          progress
        )
      }), {} as Theme['colors'])
    };
  }, [interpolateColor]);

  const previewTheme = useCallback((theme: Theme, duration: number = 2000) => {
    setPreview({
      theme,
      startTime: Date.now(),
      duration
    });

    return () => setPreview(null);
  }, []);

  const transitionToTheme = useCallback((targetTheme: Theme, duration: number = 300) => {
    setTransition({
      from: currentTheme,
      to: targetTheme,
      progress: 0,
      duration
    });
  }, [currentTheme]);

  useEffect(() => {
    if (!preview) return;

    const elapsed = Date.now() - preview.startTime;
    if (elapsed >= preview.duration) {
      setPreview(null);
      return;
    }

    const frame = requestAnimationFrame(() => {
      // Keep the preview going
    });

    return () => cancelAnimationFrame(frame);
  }, [preview]);

  useEffect(() => {
    if (!transition) return;

    const startTime = Date.now();
    let frame: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / transition.duration, 1);

      setTransition(prev => prev ? { ...prev, progress } : null);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setTransition(null);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [transition]);

  const currentDisplayTheme = preview?.theme || 
    (transition ? interpolateTheme(transition.from, transition.to, transition.progress) : currentTheme);

  return {
    currentDisplayTheme,
    isPreviewing: !!preview,
    isTransitioning: !!transition,
    previewTheme,
    transitionToTheme
  };
} 