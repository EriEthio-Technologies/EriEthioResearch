'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import type { AnimationPreset, AnimationDirection } from '@/lib/animations';
import { scrollAnimations } from '@/lib/animations';

interface ScrollAnimationOptions {
  preset?: AnimationPreset;
  direction?: AnimationDirection;
  threshold?: number;
  once?: boolean;
  delay?: number;
  stagger?: number;
  root?: Element | null;
  rootMargin?: string;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    preset = 'fade',
    direction = 'up',
    threshold = 0.1,
    once = true,
    delay = 0,
    stagger = 0,
    root = null,
    rootMargin = '0px'
  } = options;

  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: threshold,
    once,
    root,
    margin: rootMargin
  });

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const variants = scrollAnimations[preset];
  const animate = isInView ? 'animate' : 'initial';

  const transition = {
    duration: 0.5,
    delay: typeof delay === 'function' ? delay() : delay,
    ease: [0.25, 0.1, 0.25, 1],
  };

  const staggerChildren = stagger
    ? {
        transition: {
          staggerChildren: stagger,
          delayChildren: delay,
        },
      }
    : {};

  return {
    ref,
    isInView,
    hasAnimated,
    variants,
    animate,
    custom: direction,
    transition,
    ...staggerChildren,
  };
}

export function useScrollAnimationGroup(
  count: number,
  options: ScrollAnimationOptions = {}
) {
  const baseDelay = options.delay || 0;
  const stagger = options.stagger || 0.1;

  const animationConfigs = Array.from({ length: count }, (_, i) => {
    const delay = typeof baseDelay === 'number'
      ? baseDelay + i * stagger
      : () => baseDelay + i * stagger;

    return {
      ...options,
      delay,
    };
  });

  const animations = useScrollAnimation({
    ...options,
    stagger,
    delay: baseDelay
  });

  return animationConfigs.map((config, i) => ({
    ...animations,
    transition: {
      ...animations.transition,
      delay: typeof config.delay === 'function' ? config.delay() : config.delay
    }
  }));
}

export function useParallaxScroll(
  speed: number = 0.5,
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrollProgress = window.scrollY;
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setScrollY(scrollProgress * speed);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  const transform = `translateY(${scrollY}px)`;

  return {
    ref,
    style: { transform },
    ...useScrollAnimation(options),
  };
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const scrollProgress = scrollTop / (documentHeight - windowHeight);
      setProgress(Math.min(Math.max(scrollProgress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
} 