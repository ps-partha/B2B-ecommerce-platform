'use client';

import { useState } from 'react';

interface ImageItem {
  id: number;
  url: string;
  listingId: number;
  isMain: boolean;
  createdAt: string;
}

interface ProductImagesProps {
  title: string;
  images: ImageItem[];
}

const ProductImages = ({ title, images }: ProductImagesProps) => {
  const [featuredImage, setFeaturedImage] = useState<ImageItem>(images?.[0]);

  return (
    <div className="space-y-4">
      {/* Featured Image */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <img
          src={featuredImage?.url || "/placeholder.svg?height=600&width=600"}
          alt={title || "Product title"}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images?.map((img) => (
          <div
            key={img.id}
            onClick={() => setFeaturedImage(img)}
            className={`cursor-pointer overflow-hidden rounded-md border ${
              featuredImage?.id === img.id ? 'ring-2 ring-blue-500' : ''
            } bg-white`}
          >
            <img
              src={img.url || `/placeholder.svg?height=150&width=150`}
              alt={`Thumbnail ${img.id}`}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
