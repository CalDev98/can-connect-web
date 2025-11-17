"use client";

import { MapPin, Navigation } from "lucide-react";
import Image from "next/image";

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
  const mapsUrl = `https://www.google.com/maps?q=${stadium.latitude},${stadium.longitude}`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 w-full bg-gray-200">
        <Image
          src={stadium.image}
          alt={stadium.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {stadium.name}
        </h3>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{stadium.city}</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{stadium.address}</p>
        <p className="text-sm text-gray-500 mb-4">
          Capacité: {stadium.capacity.toLocaleString()} places
        </p>
        {distance !== undefined && (
          <p className="text-sm font-semibold text-moroccan-blue mb-4">
            Distance: {distance.toFixed(1)} km
          </p>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-moroccan-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Navigation className="w-4 h-4" />
          Ouvrir dans Google Maps
        </a>
      </div>
    </div>
  );
}

