import { Variants } from 'framer-motion';

export type AnimationPreset = 'fade' | 'slide' | 'scale' | 'rotate' | 'flip' | 'bounce' | 'elastic' | 'none';
export type AnimationTrigger = 'hover' | 'tap' | 'scroll' | 'load';
export type AnimationDirection = 'up' | 'down' | 'left' | 'right';

export interface AnimationConfig {
  preset: AnimationPreset;
  duration?: number;
  delay?: number;
  trigger?: AnimationTrigger;
  direction?: AnimationDirection;
  stagger?: number;
  threshold?: number; // For scroll animations
}

export const buttonAnimations: Record<AnimationPreset, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    hover: { opacity: 0.8 },
    tap: { scale: 0.95 }
  },
  scale: {
    initial: { scale: 1 },
    animate: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  },
  rotate: {
    initial: { rotate: 0 },
    animate: { rotate: 0 },
    hover: { rotate: 5 },
    tap: { rotate: -5 }
  },
  bounce: {
    initial: { y: 0 },
    animate: { y: 0 },
    hover: { y: -5 },
    tap: { y: 2 }
  },
  elastic: {
    initial: { scale: 1 },
    animate: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  },
  flip: {
    initial: { rotateX: 0 },
    animate: { rotateX: 0 },
    hover: { rotateX: 180 },
    tap: { scale: 0.95 }
  },
  none: {
    initial: {},
    animate: {},
    hover: {},
    tap: {}
  }
};

export const cardAnimations: Record<AnimationPreset, Variants> = {
  fade: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -5, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: 20 }
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    exit: { scale: 0.9, opacity: 0 }
  },
  slide: {
    initial: (direction: AnimationDirection = 'up') => ({
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
      x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
      opacity: 0
    }),
    animate: { y: 0, x: 0, opacity: 1 },
    hover: { y: -5, transition: { duration: 0.2 } },
    exit: (direction: AnimationDirection = 'down') => ({
      y: direction === 'up' ? -50 : direction === 'down' ? 50 : 0,
      x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
      opacity: 0
    })
  },
  rotate: {
    initial: { rotate: -5, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    hover: { rotate: 2, transition: { duration: 0.2 } },
    exit: { rotate: 5, opacity: 0 }
  },
  flip: {
    initial: { rotateY: -90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    hover: { rotateY: 5, transition: { duration: 0.2 } },
    exit: { rotateY: 90, opacity: 0 }
  },
  bounce: {
    initial: { scale: 0.3, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.02, transition: { type: 'spring', stiffness: 300 } },
    exit: { scale: 0.3, opacity: 0 }
  },
  elastic: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.02 },
    exit: { scale: 0.9, opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  },
  none: {
    initial: {},
    animate: {},
    hover: {},
    exit: {}
  }
};

export const scrollAnimations: Record<AnimationPreset, Variants> = {
  fade: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 }
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 }
  },
  slide: {
    initial: (direction: AnimationDirection = 'up') => ({
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
      opacity: 0
    }),
    animate: { y: 0, x: 0, opacity: 1 }
  },
  rotate: {
    initial: { rotate: -10, opacity: 0 },
    animate: { rotate: 0, opacity: 1 }
  },
  flip: {
    initial: { rotateX: -90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 }
  },
  bounce: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15
    }
  },
  elastic: {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  },
  none: {
    initial: {},
    animate: {}
  }
};

export function getAnimationVariants(
  type: 'button' | 'card' | 'scroll',
  preset: AnimationPreset,
  direction?: AnimationDirection
): Variants {
  switch (type) {
    case 'button':
      return buttonAnimations[preset];
    case 'card':
      return cardAnimations[preset];
    case 'scroll':
      return scrollAnimations[preset];
    default:
      return buttonAnimations.none;
  }
}

export function createStaggerChildren(
  childVariants: Variants,
  staggerChildren: number = 0.1
): Variants {
  return {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: staggerChildren / 2,
        staggerDirection: -1
      }
    },
    children: childVariants
  };
}

export function createScrollAnimation(
  preset: AnimationPreset,
  direction?: AnimationDirection,
  threshold: number = 0.1
) {
  return {
    variants: scrollAnimations[preset],
    initial: 'initial',
    whileInView: 'animate',
    viewport: { once: true, threshold },
    custom: direction
  };
}

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const cardVariants: Variants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

export const listItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.1 }
  })
};

export const optimizedVariants = {
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.3,
      ease: [0.17, 0.67, 0.83, 0.67] // Optimized easing curve
    }
  },
  hidden: { 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
}; 