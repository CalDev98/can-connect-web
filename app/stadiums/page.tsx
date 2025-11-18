"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocation } from "@/hooks/useLocation";
import { ArrowLeft, Search, MapPin, Filter } from "lucide-react";
import Link from "next/link";
import stadiumsData from "@/data/stadiums.json";
import { useLanguage } from "@/contexts/LanguageContext";
import { StadiumCard } from "@/components/StadiumCard"; // Import the enhanced StadiumCard

interface Stadium {
  id: number;
  name: string;
  city: string;
  capacity: number;
  latitude: number;
  longitude: number;
  address: string;
  image: string;
  distance?: number; // Add optional distance property
}

// Haversine distance function (copied from emergency page for consistency)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

export default function StadiumsPage() {
  const { t } = useLanguage();
  const { location, error: locationError } = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAndSortedStadiums = useMemo(() => {
    let filtered = stadiumsData.filter((stadium: Stadium) =>
      stadium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stadium.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (location) {
      filtered = filtered.map(stadium => ({
        stadium,
        distance: getDistance(
          location.latitude,
          location.longitude,
          stadium.latitude,
          stadium.longitude
        ),
      })).sort((a, b) => a.distance - b.distance)
      .map(item => ({ ...item.stadium, distance: item.distance })); // Add distance to stadium object
    } else {
      filtered = filtered.map(stadium => ({ ...stadium, distance: undefined }));
    }
    return filtered;
  }, [searchTerm, location]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">{t("stadiums.title")}</h1>
          <div className="w-10"></div> {/* Placeholder for alignment */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Location Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h2 className="text-sm font-bold text-blue-800 mb-2 uppercase tracking-wider">
            {t("stadiums.yourLocation")}
          </h2>
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-green-800 flex-shrink-0" />
            {location ? (
              <p className="text-lg font-mono text-blue-900">
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </p>
            ) : (
              <p className="text-blue-800">{locationError || t("stadiums.location.unavailable")}</p>
            )}
          </div>
          <p className="text-xs text-blue-700 mt-2">{t("stadiums.location.desc")}</p>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center bg-white w-full border border-gray-200 px-4 py-2 rounded-xl gap-2">
          <Search className="w-5 h-5 text-green-800" />
          <input
            type="text"
            placeholder={t("stadiums.search.placeholder")}
            className="w-full p-2 focus:outline-none focus:ring-0 focus:ring-transparent focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Stadiums List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedStadiums.length > 0 ? (
            filteredAndSortedStadiums.map((stadium) => (
              <StadiumCard key={stadium.id} stadium={stadium} distance={stadium.distance} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              <p>{t("stadiums.search.noResults")}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
