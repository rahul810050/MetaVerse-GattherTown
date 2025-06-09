"use client";

import React, { useEffect, useRef } from "react";

const images = [
  "https://images.pexels.com/photos/158607/cairn-fog-mystical-background-158607.jpeg",
  "https://images.pexels.com/photos/34950/pexels-photo.jpg",
  "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg",
  "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg",
  "https://images.pexels.com/photos/349377/pexels-photo-349377.jpeg",
  "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg",
];

// Add clones for seamless infinite scroll
const clonedImages = [...images, ...images];

export default function InfiniteCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const speed = 0.5; // pixels per frame, adjust slower/faster

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Start scroll at 0
    container.scrollLeft = 0;

    const maxScroll = container.scrollWidth / 2;

    function step() {
      if (!container) return;

      container.scrollLeft += speed;

      if (container.scrollLeft >= maxScroll) {
        // reset scroll to start for infinite effect
        container.scrollLeft = 0;
      }

      animationRef.current = requestAnimationFrame(step);
    }

    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-screen-xl mx-auto overflow-hidden">
      <div
        ref={containerRef}
        className="flex whitespace-nowrap"
        style={{ scrollBehavior: "auto" }}
      >
        {clonedImages.map((src, i) => (
          <div
            key={i}
            className="inline-block p-2"
            style={{ flexShrink: 0, width: "33.3333%" /* 3 items per view */ }}
          >
            <div className="rounded-lg shadow-md overflow-hidden h-[200px] relative">
              <img
                src={src}
                alt={`Slide ${i}`}
                className="object-cover w-full h-full"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
