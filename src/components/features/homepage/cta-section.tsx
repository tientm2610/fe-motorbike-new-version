"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui";
import { GlassCard } from "@/components/ui";

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "2-Year Warranty",
    description: "Comprehensive coverage for peace of mind",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: "Easy Financing",
    description: "Flexible payment plans with competitive rates",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 42h.583a.583.583 0 00.583-.583V39.75a.583.583 0 00-.583-.583h-1.167a.583.583 0 00-.583.583v1.667c0 .321.262.583.583.583H11m5.417-15.75h1.083a.583.583 0 01.583.583v1.667a.583.583 0 01-.583.583h-1.083a.583.583 0 01-.583-.583v-1.667c0-.321.262-.583.583-.583zM20.25 10.5h.708a.375.375 0 00.375-.375v-.667a.375.375 0 00-.375-.375h-1.083a.375.375 0 00-.375.375v.667c0 .207.168.375.375.375H20.25M9 12.75h.75a.375.375 0 00.375-.375v-.667a.375.375 0 00-.375-.375h-1.5a.375.375 0 00-.375.375v.667c0 .207.168.375.375.375H9M4.5 10.5h.708a.375.375 0 00.375-.375v-.667a.375.375 0 00-.375-.375H3.75a.375.375 0 00-.375.375v.667c0 .207.168.375.375.375H4.5M3 15.75h.708a.375.375 0 00.375-.375v-.667a.375.375 0 00-.375-.375H2.25a.375.375 0 00-.375.375v.667c0 .207.168.375.375.375H3M9 18h.75a.375.375 0 00.375-.375v-.667a.375.375 0 00-.375-.375h-1.5a.375.375 0 00-.375.375v.667c0 .207.168.375.375.375H9" />
      </svg>
    ),
    title: "Trade-in Program",
    description: "Get the best value for your current bike",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Quick Delivery",
    description: "Same-day processing and fast shipping",
  },
];

export function CTASection() {
  return (
    <section className="py-20 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Banner */}
        <GlassCard className="relative overflow-hidden py-16 px-8 sm:px-16">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white"
              >
                Ready to Ride?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-lg text-neutral-600 dark:text-neutral-400"
              >
                Visit our showroom or contact us today to find your perfect Honda motorcycle.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <ButtonLink href="/motorcycles" size="lg">Browse Motorcycles</ButtonLink>
                <ButtonLink href="/contact" variant="outline" size="lg">Contact Us</ButtonLink>
              </motion.div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center dark:bg-primary-900/30 dark:text-primary-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

export default CTASection;