import type { AnimationPreset, AnimationDirection } from '@/lib/animations';

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
    border: string;
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
    surface?: string;
    overlay?: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono?: string;
  };
  spacing: {
    base: number;
    scale: number;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  animations: {
    buttons: {
      preset: AnimationPreset;
      duration?: number;
    };
    cards: {
      preset: AnimationPreset;
      direction?: AnimationDirection;
      duration?: number;
    };
    scroll: {
      preset: AnimationPreset;
      direction?: AnimationDirection;
      threshold?: number;
      stagger?: number;
    };
    page: {
      enter: AnimationPreset;
      exit: AnimationPreset;
      duration?: number;
    };
    transitions: {
      duration: string;
      timing: string;
      properties: string[];
    };
  };
  effects?: {
    shadows?: {
      sm: string;
      md: string;
      lg: string;
    };
    glassmorphism?: {
      opacity: number;
      blur: string;
    };
    gradients?: {
      primary: {
        from: string;
        to: string;
        direction?: string;
      };
      secondary?: {
        from: string;
        to: string;
        direction?: string;
      };
    };
  };
}

export interface ThemePreview {
  theme: Theme;
  startTime: number;
  duration: number;
}

export interface ThemeTransition {
  from: Theme;
  to: Theme;
  progress: number;
  duration: number;
}

export const defaultAnimations = {
  buttons: {
    preset: 'scale' as AnimationPreset,
    duration: 0.2
  },
  cards: {
    preset: 'fade' as AnimationPreset,
    direction: 'up' as AnimationDirection,
    duration: 0.3
  },
  scroll: {
    preset: 'fade' as AnimationPreset,
    direction: 'up' as AnimationDirection,
    threshold: 0.1,
    stagger: 0.1
  },
  page: {
    enter: 'fade' as AnimationPreset,
    exit: 'fade' as AnimationPreset,
    duration: 0.3
  },
  transitions: {
    duration: '0.3s',
    timing: 'ease-in-out',
    properties: [
      'color',
      'background-color',
      'border-color',
      'box-shadow',
      'transform',
      'opacity'
    ]
  }
}; 