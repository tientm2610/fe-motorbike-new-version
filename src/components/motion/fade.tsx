"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";

interface FadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const Fade = forwardRef<HTMLDivElement, FadeProps>(
  ({ children, className, delay = 0 }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
);

Fade.displayName = "Fade";