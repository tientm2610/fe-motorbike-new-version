"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { cn } from "@/lib";
import type { HomepageMotorcycle } from "@/types";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};

interface FeaturedMotorcyclesProps {
  motorcycles: HomepageMotorcycle[];
}

export function FeaturedMotorcycles({ motorcycles }: FeaturedMotorcyclesProps) {
  return (
    <section className="py-20 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium dark:bg-primary-900/30 dark:text-primary-300">
            New Arrivals
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
Xe nổi bật

              Khám phá bộ sưu tập xe Honda mới nhất
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400 max-w-2xl">
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {motorcycles.map((motorcycle, index) => (
            <motion.div
              key={motorcycle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/motorcycles/${motorcycle.slug}`}>
                <Card variant="interactive" padding="none" className="group overflow-hidden">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={motorcycle.thumbnailUrl}
                      alt={motorcycle.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      {motorcycle.isAvailable ? (
                        <Badge variant="success">Còn hàng</Badge>
                      ) : (
                        <Badge variant="error">Hết hàng</Badge>
                      )}
                    </div>

                    {/* Quick View Button */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {motorcycle.categoryName}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                      {motorcycle.name}
                    </h3>
                    <p className="mt-2 text-xl font-bold text-primary-600 dark:text-primary-400">
                      {formatPrice(motorcycle.minPrice)}
                    </p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/motorcycles">
            <Button variant="outline" size="lg">
              Xem tất cả xe
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedMotorcycles;