import { type Variants } from "framer-motion";

export const transitions = {
  fast: { duration: 0.15 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
  spring: { type: "spring" as const, stiffness: 300, damping: 30 },
  springBounce: { type: "spring" as const, stiffness: 400, damping: 25 },
} as const;

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: transitions.normal },
  exit: { opacity: 0, y: -8, transition: transitions.fast },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitions.normal },
  exit: { opacity: 0, transition: transitions.fast },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: transitions.normal },
  exit: { opacity: 0, y: -20, transition: transitions.fast },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: transitions.normal },
  exit: { opacity: 0, y: 20, transition: transitions.fast },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: transitions.spring },
  exit: { opacity: 0, scale: 0.95, transition: transitions.fast },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0, transition: transitions.spring },
  exit: { opacity: 0, x: -100, transition: transitions.fast },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0, transition: transitions.spring },
  exit: { opacity: 0, x: 100, transition: transitions.fast },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: transitions.normal },
};

export const hoverLift: Variants = {
  rest: { y: 0, transition: transitions.fast },
  hover: { y: -4, transition: transitions.spring },
};

export const imageZoom: Variants = {
  rest: { scale: 1, transition: transitions.normal },
  hover: { scale: 1.05, transition: transitions.slow },
};

export const buttonTap: Variants = {
  rest: { scale: 1, transition: transitions.fast },
  tap: { scale: 0.98, transition: transitions.fast },
};

export const shimmer: Variants = {
  initial: { x: "-100%" },
  animate: { x: "100%", transition: { duration: 1.5, repeat: Infinity, ease: "linear" } },
};

export const pulse: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: { scale: 1.02, opacity: 0.8, transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } },
};