"use client";

import { useMemo } from "react";

interface SpecificationsProps {
  specsJson: string;
  productName: string;
}

type SpecCategory = {
  categoryName?: string;
  name?: string;
  [key: string]: unknown;
};

export function Specifications({ specsJson, productName }: SpecificationsProps) {
  const specs = useMemo((): SpecCategory[] | null => {
    if (!specsJson) return null;
    try {
      const parsed = JSON.parse(specsJson);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === "object" && parsed !== null) return [parsed];
      return null;
    } catch {
      return null;
    }
  }, [specsJson]);

  if (!specs) {
    return (
      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          No specifications available for {productName}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
        Specifications
      </h2>

      <div className="grid gap-4">
        {specs.map((category, index) => {
          const categoryName = category.categoryName || category.name || `Category ${index + 1}`;
          const rawItems = category.items || Object.entries(category).filter(([key]) => key !== "categoryName" && key !== "name");
          const items = Array.isArray(rawItems) ? rawItems : [];

          return (
            <div 
              key={index}
              className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-5"
            >
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
                {categoryName}
              </h3>

              <div className="grid gap-3">
                {items.map((item, idx) => {
                  const label = Array.isArray(item) ? String(item[0]) : String((item as Record<string, unknown>)?.label || "");
                  const value = Array.isArray(item) ? String(item[1]) : String((item as Record<string, unknown>)?.value || "");

                  return (
                    <div 
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-700 last:border-0"
                    >
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {label}
                      </span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Specifications;