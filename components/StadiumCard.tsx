"use client";

import { MapPin, Navigation, Users } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext"; // Import useLanguage

interface Stadium {
  id: number;
  name: string;
  city: string;
  capacity: number;
  latitude: number;
  longitude: number;
  address: string;
  image: string;
}

interface StadiumCardProps {
  stadium: Stadium;
  distance?: number;
}

export function StadiumCard({ stadium, distance }: StadiumCardProps) {
  const { t } = useLanguage(); // Use the translation hook
  const mapsUrl = `https://www.google.com/maps?q=${stadium.latitude},${stadium.longitude}`;
  const placeholderImage = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400"; // Generic stadium image

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      <div className="relative h-48 w-full bg-gray-200">
        <Image
          src={stadium.image || placeholderImage}
          alt={stadium.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h3 className="absolute bottom-0 left-0 p-4 text-xl font-bold text-white z-10">
          {stadium.name}
        </h3>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="w-5 h-5 text-green-800" />
          <span className="text-base font-medium">{stadium.city}</span>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-500">{stadium.address}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-5 h-5 text-green-800" />
          <span className="text-sm">{t("stadiums.capacity", { capacity: stadium.capacity.toLocaleString() })}</span>
        </div>
        {distance !== undefined && (
          <div className="flex items-center gap-2 text-moroccan-gold">
            <Navigation className="w-5 h-5" />
            <span className="text-base font-semibold">
              {t("stadiums.distance", { distance: distance.toFixed(1) })}
            </span>
          </div>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 bg-green-800 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium mt-4"
        >
          <Navigation className="w-5 h-5" />
          {t("stadiums.openMaps")}
        </a>
      </div>
    </div>
  );
}

