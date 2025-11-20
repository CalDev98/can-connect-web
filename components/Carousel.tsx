"use client";

import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

const slides = [
  {
    title: "Discover the Heart of Morocco",
    description: "Experience the vibrant culture and stunning landscapes.",
    gradient: "from-moroccan-red to-moroccan-orange",
  },
  {
    title: "Journey Through the Atlas",
    description: "Explore ancient traditions and breathtaking mountain views.",
    gradient: "from-moroccan-green to-moroccan-blue",
  },
  {
    title: "Sahara's Golden Dunes",
    description: "Witness the magic of the desert and its endless horizons.",
    gradient: "from-moroccan-gold to-moroccan-yellow",
  },
  {
    title: "Imperial Cities Await",
    description: "Uncover the history and grandeur of Morocco's royal past.",
    gradient: "from-moroccan-blue to-moroccan-green",
  },
  {
    title: "Coastal Charms of Essaouira",
    description: "Relax by the sea and enjoy the artistic soul of the city.",
    gradient: "from-moroccan-orange to-moroccan-red",
  },
];

export function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      };
      emblaApi.on("select", onSelect);
      return () => {
        emblaApi.off("select", onSelect);
      };
    }
  }, [emblaApi]);

  return (
    <div className="embla mb-6 rounded-xl overflow-hidden shadow-lg" ref={emblaRef}>
      <div className="embla__container">
        {slides.map((slide, index) => (
          <div className="embla__slide" key={index}>
            <div className={`relative h-64 w-full bg-gradient-to-br ${slide.gradient} flex items-center justify-center`}>
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 100% 150%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 0% -50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                backgroundSize: '50% 50%',
              }}></div>
              <div className="relative z-10 text-center text-white p-4">
                <h2 className="text-2xl font-bold drop-shadow">{slide.title}</h2>
                <p className="text-md mt-1 drop-shadow">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="embla__dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`embla__dot ${index === selectedIndex ? 'embla__dot--selected' : ''}`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}