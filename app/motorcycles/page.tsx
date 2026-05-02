"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Input, Button, Select, SkeletonCard, EmptyState, PageLoader } from "@/components/ui";
import { MotorcycleCard } from "@/components/features/motorcycles/motorcycle-card";
import { FilterSidebar, MobileFilter, type MotorcycleFilters } from "@/components/features/motorcycles/filter-sidebar";
import { motorcycleService } from "@/services/motorcycle.service";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib";

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const sortOptions = [
  { value: "createdAt,DESC", label: "Newest First" },
  { value: "createdAt,ASC", label: "Oldest First" },
  { value: "minPrice,ASC", label: "Price: Low to High" },
  { value: "minPrice,DESC", label: "Price: High to Low" },
];

const initialFilters: MotorcycleFilters = {
  brandIds: [],
  categoryIds: [],
  priceRange: [0, 200000000],
  inStockOnly: false,
};

function MotorcyclesContent() {
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("keyword") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [filters, setFilters] = useState<MotorcycleFilters>(initialFilters);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState(searchParams.get("sort") || "createdAt,DESC");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: () => motorcycleService.getBrands(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => motorcycleService.getCategories(),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["motorcycles", page, sort, filters, debouncedSearch],
    queryFn: () => motorcycleService.getMotorcycles({
      page,
      size: 12,
      sort,
      brandId: filters.brandIds.length === 1 ? filters.brandIds[0] : undefined,
      categoryId: filters.categoryIds.length === 1 ? filters.categoryIds[0] : undefined,
      keyword: debouncedSearch || undefined,
      status: filters.inStockOnly ? "ACTIVE" : undefined,
    }),
  });

  const motorcycles = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Motorcycles
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            {totalElements} motorcycles available
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <Input
                type="search"
                placeholder="Search motorcycles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setMobileFilterOpen(true)}
            >
              <FilterIcon />
              Filters
            </Button>

            {/* <Select
              options={sortOptions}
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(0);
              }}
              className="w-48"
            /> */}

            <div className="hidden sm:flex border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "grid"
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
                )}
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "list"
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
                )}
              >
                <ListIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={(newFilters) => {
                setFilters(newFilters);
                setPage(0);
              }}
              brands={brands}
              categories={categories}
            />
          </aside>

          <div className="flex-1">
            {isLoading ? (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : isError ? (
              <EmptyState
                title="Error loading motorcycles"
                description="Something went wrong. Please try again."
                action={{ label: "Retry", onClick: () => window.location.reload() }}
              />
            ) : motorcycles.length === 0 ? (
              <EmptyState
                title="No motorcycles found"
                description="Try adjusting your filters or search query."
                icon={
                  <svg className="h-16 w-16 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}
              >
                {motorcycles.map((motorcycle, index) => (
                  <motion.div
                    key={motorcycle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MotorcycleCard motorcycle={motorcycle} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + Math.max(0, page - 2);
                  if (pageNum >= totalPages) return null;
                  return (
                    <Button
                      key={i}
                      variant={page === pageNum ? "primary" : "outline"}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileFilter
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters);
          setPage(0);
        }}
        brands={brands}
        categories={categories}
      />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
      <PageLoader />
    </div>
  );
}

export default function MotorcyclesPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MotorcyclesContent />
    </Suspense>
  );
}