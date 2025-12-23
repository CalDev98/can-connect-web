"use client";

import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const slides = [
  {
    title: "Discover the Heart of Morocco",
    description: "Experience the vibrant culture and stunning landscapes.",
    gradient: "from-moroccan-red to-moroccan-orange",
    image: "/images/ads/lyset.png",
    id: "e71e6715-280d-4b83-b2f6-7462c9929d48",
    link: "https://wa.me/212660853560?text=Bonjour, je voudrais en savoir plus sur votre service.",
  },
  {
    title: "Journey Through the Atlas",
    description: "Explore ancient traditions and breathtaking mountain views.",
    gradient: "from-moroccan-green to-moroccan-blue",
    image: "",
    id: "2",
    link: "",
  },
  {
    title: "Sahara's Golden Dunes",
    description: "Witness the magic of the desert and its endless horizons.",
    gradient: "from-moroccan-gold to-moroccan-yellow",
    image: "",
    id: "3",
    link: "",
  },
  {
    title: "Imperial Cities Await",
    description: "Uncover the history and grandeur of Morocco's royal past.",
    gradient: "from-moroccan-blue to-moroccan-green",
    image: "",
    id: "4",
    link: "",
  },
  {
    title: "Coastal Charms of Essaouira",
    description: "Relax by the sea and enjoy the artistic soul of the city.",
    gradient: "from-moroccan-orange to-moroccan-red",
    image: "",
    id: "5",
    link: "",
  },
];

export function EmblaCarousel() {
  const activeSlides = slides.filter(slide => slide.image || slide.title);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: activeSlides.length > 1 },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
      emblaApi.on("select", onSelect);
      return () => { emblaApi.off("select", onSelect); };
    }
  }, [emblaApi]);

  if (activeSlides.length === 0) return null;

  return (
    <div className="embla mb-6 h-[200px] rounded-xl overflow-hidden shadow-lg" ref={emblaRef}>
      <div className="embla__container">
        {activeSlides.map((slide, index) => (
          <CarouselSlide key={slide.id || index} slide={slide} />
        ))}
      </div>
      {activeSlides.length > 1 && (
        <div className="embla__dots">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              className={`embla__dot ${index === selectedIndex ? 'embla__dot--selected' : ''}`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CarouselSlide({ slide }: { slide: any }) {
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const slideRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slide.id || hasTrackedImpression) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setHasTrackedImpression(true);
            observer.unobserve(entry.target);

            const today = new Date().toISOString().split('T')[0];
            console.log(`[Impression] Tracking for ${slide.id}`);

            if (supabase) {
              const { error } = await supabase.rpc('increment_impressions', {
                p_campaign_id: slide.id,
                p_date: today
              });

              if (error) console.error('Error tracking impression:', error);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (slideRef.current) {
      observer.observe(slideRef.current);
    }

    return () => observer.disconnect();
  }, [slide.id, hasTrackedImpression]);

  const handleSlideClick = async (e: React.MouseEvent) => {
    // We don't prevent default to allow the Link to work, 
    // but we track the click asynchronously
    if (!slide.id) return;

    const today = new Date().toISOString().split('T')[0];
    console.log(`[Click] Tracking for ${slide.id}`);

    if (supabase) {
      const { error } = await supabase.rpc('increment_clicks', {
        p_campaign_id: slide.id,
        p_date: today
      });

      if (error) console.error('Error tracking click:', error);
    }
  };

  return (
    <div className="embla__slide" ref={slideRef}>
      {slide.image ? (
        <Link href={slide.link} onClick={handleSlideClick}>
          <img src={slide.image} alt={slide.title} className="w-full h-[200px] object-contain" />
        </Link>
      ) : (
        <div className={`relative h-[200px] w-full bg-gradient-to-br ${slide.gradient} flex items-center justify-center`}>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 100% 150%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 0% -50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
            backgroundSize: '50% 50%',
          }}></div>
          <div className="relative z-10 text-center text-white p-4">
            <h2 className="text-2xl font-bold drop-shadow">{slide.title}</h2>
            <p className="text-md mt-1 drop-shadow">{slide.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}