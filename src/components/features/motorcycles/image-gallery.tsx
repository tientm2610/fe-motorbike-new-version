"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib";

interface VariantImage {
  id: number;
  imageUrl: string;
  isThumbnail: boolean;
  displayOrder: number;
}

interface ImageGalleryProps {
  images: VariantImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allImages = images.length > 0 
    ? images 
    : [{ id: 0, imageUrl: "/placeholder-motorcycle.jpg", isThumbnail: true, displayOrder: 0 }];

  const selectedImage = allImages[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={selectedImage.imageUrl}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        
        {/* Zoom hint */}
        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white">
          Hover to zoom
        </div>
      </div>

      {/* Thumbnail Grid */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg transition-all duration-200",
                "ring-2 ring-offset-2",
                selectedIndex === index 
                  ? "ring-primary-500" 
                  : "ring-transparent hover:ring-neutral-300 dark:hover:ring-neutral-600"
              )}
            >
              <Image
                src={image.imageUrl}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGallery;