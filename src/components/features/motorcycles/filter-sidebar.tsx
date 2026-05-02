"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, IconButton, Checkbox, Input, Badge } from "@/components/ui";
import { Card } from "@/components/ui";
import { cn } from "@/lib";

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-medium text-neutral-900 dark:text-white">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.2 }}>
          <ChevronDownIcon />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export interface MotorcycleFilters {
  brandIds: number[];
  categoryIds: number[];
  priceRange: [number, number];
  inStockOnly: boolean;
}

interface FilterSidebarProps {
  filters: MotorcycleFilters;
  onFiltersChange: (filters: MotorcycleFilters) => void;
  brands: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  className?: string;
}

export function FilterSidebar({ filters, onFiltersChange, brands, categories, className }: FilterSidebarProps) {
  const toggleBrand = (brandId: number) => {
    const newBrandIds = filters.brandIds.includes(brandId)
      ? filters.brandIds.filter((id) => id !== brandId)
      : [...filters.brandIds, brandId];
    onFiltersChange({ ...filters, brandIds: newBrandIds });
  };

  const toggleCategory = (categoryId: number) => {
    const newCategoryIds = filters.categoryIds.includes(categoryId)
      ? filters.categoryIds.filter((id) => id !== categoryId)
      : [...filters.categoryIds, categoryId];
    onFiltersChange({ ...filters, categoryIds: newCategoryIds });
  };

  const clearFilters = () => {
    onFiltersChange({
      brandIds: [],
      categoryIds: [],
      priceRange: [0, 200000000],
      inStockOnly: false,
    });
  };

  const activeFiltersCount =
    filters.brandIds.length + filters.categoryIds.length + (filters.inStockOnly ? 1 : 0);

  return (
    <Card className={cn("sticky top-24", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FilterIcon />
          <span className="font-semibold text-neutral-900 dark:text-white">Bộ lọc</span>
          {activeFiltersCount > 0 && (
            <Badge variant="info">{activeFiltersCount}</Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <FilterSection title="Hãng xe">
        <div className="space-y-3">
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={filters.brandIds.includes(brand.id)}
                onChange={() => toggleBrand(brand.id)}
              />
              <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Danh mục">
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={filters.categoryIds.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
              />
              <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Tình trạng">
        <label className="flex items-center gap-3 cursor-pointer group">
          <Checkbox
            checked={filters.inStockOnly}
            onChange={(e) => onFiltersChange({ ...filters, inStockOnly: e.target.checked })}
          />
          <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">
            Chỉ hiển thị còn hàng
          </span>
        </label>
      </FilterSection>
    </Card>
  );
}

interface MobileFilterProps extends FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFilter({ isOpen, onClose, ...props }: MobileFilterProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-neutral-900 shadow-xl lg:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <span className="font-semibold text-lg text-neutral-900 dark:text-white">Filters</span>
              <IconButton variant="ghost" size="sm" onClick={onClose}>
                <XIcon />
              </IconButton>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
              <FilterSidebar {...props} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default FilterSidebar;