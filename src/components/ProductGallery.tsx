"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  label: string;
  variant?: "featured" | "supporting";
};

function imageStyle(image: string): CSSProperties {
  return { "--gallery-image": `url(${image})` } as CSSProperties;
}

export function ProductGallery({
  images,
  label,
  variant = "supporting",
}: ProductGalleryProps) {
  const galleryImages = images.length > 0 ? images : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex] ?? "";
  const hasMultipleImages = galleryImages.length > 1;

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1,
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasMultipleImages) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  };

  return (
    <div
      className={`product-gallery product-gallery--${variant}`}
      aria-label={`${label} gallery`}
      onKeyDown={handleKeyDown}
    >
      <div
        className="product-gallery__stage"
        role="img"
        aria-label={label}
        style={imageStyle(activeImage)}
        tabIndex={hasMultipleImages ? 0 : undefined}
      >
        {hasMultipleImages ? (
          <>
            <button
              className="product-gallery__arrow product-gallery__arrow--prev"
              type="button"
              aria-label="Previous image"
              onClick={showPrevious}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              className="product-gallery__arrow product-gallery__arrow--next"
              type="button"
              aria-label="Next image"
              onClick={showNext}
            >
              <span aria-hidden="true">›</span>
            </button>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="product-gallery__thumbs" aria-label="Gallery images">
          {galleryImages.map((image, index) => (
            <button
              className={`product-gallery__thumb${
                index === activeIndex ? " is-active" : ""
              }`}
              key={`${image}-${index}`}
              type="button"
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
              style={imageStyle(image)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
