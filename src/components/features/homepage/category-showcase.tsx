"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui";

const categories = [
  {
    id: 1,
    name: "Scooter",
    slug: "scooter",
    description: "City-friendly & comfortable",
    image: "https://images.unsplash.com/photo-1558616304-5bb8437f6b22?w=400&h=300&fit=crop",
    count: 12,
  },
  {
    id: 2,
    name: "Sport",
    slug: "sport",
    description: "Speed & performance",
    image: "https://images.unsplash.com/photo-1609630875171-1d6e0e104c3c?w=400&h=300&fit=crop",
    count: 8,
  },
  {
    id: 3,
    name: "Naked Bike",
    slug: "naked-bike",
    description: "Street & urban style",
    image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=400&h=300&fit=crop",
    count: 6,
  },
  {
    id: 4,
    name: "Adventure",
    slug: "adventure",
    description: "Explore the unknown",
    image: "https://images.unsplash.com/photo-1558616304-5bb8437f6b22?w=400&h=300&fit=crop",
    count: 4,
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-100 text-accent-700 text-sm font-medium dark:bg-accent-900/30 dark:text-accent-300">
            Danh mục xe
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
            Find Your Perfect Bike
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Choose from a variety of motorcycle categories to suit your needs
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/motorcycles?category=${category.slug}`}>
                <Card
                  variant="interactive"
                  className="relative overflow-hidden group h-full min-h-[240px]"
                  padding="none"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-neutral-300 text-sm">
                      {category.description}
                    </p>
                    <p className="mt-3 text-sm font-medium text-primary-400">
                      {category.count} models →
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/10 transition-colors" />
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryShowcase;