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
    image: "/images/ads/lyset_yada_training.png",
    id: "e71e6715-280d-4b83-b2f6-7462c9929d48",
    link: "https://wa.me/212655555555?text=Bonjour, je voudrais en savoir plus sur votre service.",
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
  // Filter slides that have an image or a title
  const activeSlides = slides.filter(slide => slide.image || slide.title);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: activeSlides.length > 1 },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSlideClick = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      console.log("Tracking click for:", { id, today });

      // First, check if a record exists for this campaign and today's date
      const { data: stats, error: fetchError } = await supabase
        .from('campaign_stats')
        .select('clicks')
        .eq('campaign_id', id)
        .eq('date', today)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Fetch error:', fetchError);
        throw fetchError;
      }

      console.log("Current stats:", stats);

      if (stats) {
        // Increment existing
        const { data, error: updateError } = await supabase
          .from('campaign_stats')
          .update({ clicks: (stats.clicks || 0) + 1 })
          .eq('campaign_id', id)
          .eq('date', today)
          .select();

        if (updateError) {
          console.error('Error updating click count:', updateError);
        } else {
          console.log('Successfully updated click count. New data:', data);
        }
      } else {
        // Create new record
        const { data, error: insertError } = await supabase
          .from('campaign_stats')
          .insert({ campaign_id: id, clicks: 1, date: today })
          .select();

        if (insertError) {
          console.error('Error inserting new click record:', insertError);
        } else {
          console.log('Successfully inserted new click record. New data:', data);
        }
      }
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  };

  const handleSlideImpression = async (id: string) => {
    if (!supabase) return;

    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      console.log("Tracking impression for:", { id, today });

      // First, check if a record exists for this campaign and today's date
      const { data: stats, error: fetchError } = await supabase
        .from('campaign_stats')
        .select('impressions')
        .eq('campaign_id', id)
        .eq('date', today)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Fetch error (impression):', fetchError);
        throw fetchError;
      }

      if (stats) {
        // Increment existing
        const { error: updateError } = await supabase
          .from('campaign_stats')
          .update({ impressions: (stats.impressions || 0) + 1 })
          .eq('campaign_id', id)
          .eq('date', today);

        if (updateError) {
          console.error('Error updating impression count:', updateError);
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('campaign_stats')
          .insert({ campaign_id: id, impressions: 1, date: today, clicks: 0 });

        if (insertError) {
          console.error('Error inserting new impression record:', insertError);
        }
      }
    } catch (err) {
      console.error('Error tracking impression:', err);
    }
  };

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        const index = emblaApi.selectedScrollSnap();
        setSelectedIndex(index);

        // Track impression for the newly selected slide
        const slide = activeSlides[index];
        if (slide && slide.id) {
          handleSlideImpression(slide.id.toString());
        }
      };

      // Track initial slide impression
      const initialIndex = emblaApi.selectedScrollSnap();
      const initialSlide = activeSlides[initialIndex];
      if (initialSlide && initialSlide.id) {
        handleSlideImpression(initialSlide.id.toString());
      }

      emblaApi.on("select", onSelect);
      emblaApi.reInit(); // Re-initialize when slides might have changed
      return () => {
        emblaApi.off("select", onSelect);
      };
    }
  }, [emblaApi, activeSlides]);

  if (activeSlides.length === 0) return null;

  return (
    <div className="embla mb-6 h-[200px] rounded-xl overflow-hidden shadow-lg" ref={emblaRef}>
      <div className="embla__container">
        {activeSlides.map((slide, index) => (
          <div className="embla__slide" key={index}>
            {slide.image ? (
              <Link href={slide.link} onClick={(e) => handleSlideClick(e, slide.id)}>
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
              </div>)}
          </div>
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
  )
}