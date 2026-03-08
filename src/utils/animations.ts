// Animation variants for Framer Motion or CSS transitions

// Fade animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
}

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4 }
}

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 }
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.4 }
}

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.4 }
}

// Scale animations
export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { duration: 0.3 }
}

export const scaleInBounce = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1.05, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
  transition: { duration: 0.3 }
}

// Slide animations
export const slideInLeft = {
  initial: { x: -300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 30 }
}

export const slideInRight = {
  initial: { x: 300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 300, opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 30 }
}

export const slideInTop = {
  initial: { y: -300, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -300, opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 30 }
}

export const slideInBottom = {
  initial: { y: 300, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 300, opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 30 }
}

// Rotate animations
export const rotateIn = {
  initial: { rotate: -180, opacity: 0 },
  animate: { rotate: 0, opacity: 1 },
  exit: { rotate: 180, opacity: 0 },
  transition: { duration: 0.5 }
}

export const spin = {
  animate: { rotate: 360 },
  transition: { repeat: Infinity, duration: 1, ease: 'linear' }
}

// Pulse animation
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { repeat: Infinity, duration: 1.5 }
  }
}

// Bounce animation
export const bounce = {
  animate: {
    y: [0, -15, 0],
    transition: { repeat: Infinity, duration: 1.5 }
  }
}

// Shake animation
export const shake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
}

// Stagger children animations
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// Page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 }
}

// Modal animations
export const modalAnimation = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  content: {
    initial: { scale: 0.8, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.8, opacity: 0, y: 20 }
  }
}

// Hover animations
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
}

export const hoverLift = {
  whileHover: { y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }
}

export const hoverGlow = {
  whileHover: { 
    boxShadow: '0 0 20px rgba(168,85,247,0.5)',
    scale: 1.02
  }
}

// List item animations
export const listItem = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
}

// CSS class names for animations
export const cssAnimations = {
  fadeIn: 'animate-fadeIn',
  fadeInUp: 'animate-fadeInUp',
  fadeInDown: 'animate-fadeInDown',
  slideInLeft: 'animate-slideInLeft',
  slideInRight: 'animate-slideInRight',
  scaleIn: 'animate-scaleIn',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  shake: 'animate-shake'
}

// Animation timing constants
export const timing = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8
}

// Easing functions
export const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
}