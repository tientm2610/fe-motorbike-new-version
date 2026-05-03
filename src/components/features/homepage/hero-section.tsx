"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui";
import type { HomepageHero } from "@/types";

const MotorcycleIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

interface HeroSectionProps {
  hero: HomepageHero;
}

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-850">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium dark:bg-primary-900/30 dark:text-primary-300 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              Đại lý Honda chính hãng
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 dark:text-white leading-tight"
            >
              {hero.title.split(' ').slice(0, 2).join(' ')}
              <span 
                className="block text-transparent bg-clip-text"
                style={{ 
                  backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-primary))`,
                  filter: 'brightness(1.2)'
                }}
              >
                {hero.title.split(' ').slice(2).join(' ') || hero.title}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-xl text-neutral-600 dark:text-neutral-400 max-w-lg"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              {hero.ctaPrimaryText && (
                <ButtonLink href={hero.ctaPrimaryLink || "/motorcycles"} size="lg" className="group">
                  <MotorcycleIcon />
                  {hero.ctaPrimaryText}
                  <ArrowRightIcon />
                </ButtonLink>
              )}
              {hero.ctaSecondaryText && (
                <ButtonLink href={hero.ctaSecondaryLink || "/about"} variant="outline" size="lg">
                  {hero.ctaSecondaryText}
                </ButtonLink>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 grid grid-cols-3 gap-8"
            >
              {[
                { value: "500+", label: "Xe máy" },
                { value: "15+", label: "Năm kinh nghiệm" },
                { value: "10k+", label: "Khách hàng hài lòng" },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold text-neutral-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Motorcycle Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              {hero.heroImage ? (
                <img
                  src={hero.heroImage}
                  alt={hero.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                  <span className="text-neutral-400">No image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Decorative elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-10 w-40 h-40 border-2 border-primary-200 rounded-full opacity-30"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-10 -left-10 w-32 h-32 border-2 border-accent-200 rounded-full opacity-30"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-neutral-300 dark:border-neutral-600 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-neutral-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroSection;