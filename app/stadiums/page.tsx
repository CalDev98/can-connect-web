"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocation } from "@/hooks/useLocation";
import { ArrowLeft, Filter, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import stadiumsData from "@/data/stadiums.json";
import { useLanguage } from "@/contexts/LanguageContext";

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

export default function StadiumsPage() {
  const { t } = useLanguage();
  const { location, calculateDistance } = useLocation();
  const [stadiums, setStadiums] = useState<Stadium[]>([]);

  useEffect(() => {
    setStadiums(stadiumsData as Stadium[]);
  }, []);

  const stadiumsWithDistance = useMemo(() => {
    if (!location) return stadiums.map(s => ({ stadium: s, distance: undefined }));

    return stadiums.map(stadium => ({
      stadium,
      distance: calculateDistance(
        location.latitude,
        location.longitude,
        stadium.latitude,
        stadium.longitude
      ),
    })).sort((a, b) => {
      if (a.distance === undefined) return 1;
      if (b.distance === undefined) return -1;
      return a.distance - b.distance;
    });
  }, [stadiums, location, calculateDistance]);

  const openMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <header className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">{t("stadiums.title")}</h1>
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <Filter className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <div className="space-y-4">
          {stadiumsWithDistance.map(({ stadium, distance }) => (
            <div
              key={stadium.id}
              className="bg-white rounded-xl overflow-hidden shadow-md"
            >
              {/* Stadium Image */}
              <div className="relative h-48 w-full bg-gray-200">
                <Image
                  src={stadium.image}
                  alt={stadium.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Stadium Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {stadium.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span>📍</span>
                  <span>{stadium.city}</span>
                  {distance !== undefined && (
                    <>
                      <span>•</span>
                      <span>{t("stadiums.distance", { distance: distance.toFixed(1) })}</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => openMaps(stadium.latitude, stadium.longitude)}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Send className="w-4 h-4" />
                  {t("stadiums.openMaps")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
