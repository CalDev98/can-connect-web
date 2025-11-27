"use client";

import { useState } from "react";
import { ArrowLeft, Phone, MapPin, Siren, Hospital, ShieldAlert, Globe } from "lucide-react";
import Link from "next/link";
import emergencyData from "@/data/emergency.json";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "@/hooks/useLocation";
import BottomNav from "@/components/BottomNav";

// Haversine distance function
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
  return distance.toFixed(1); // Return distance with 1 decimal place
};

const EmergencyIcon = ({ name }: { name: string }) => {
  switch (name.toLowerCase()) {
    case "police":
      return <Siren className="w-8 h-8 text-white" />;
    case "ambulance":
      return <Hospital className="w-8 h-8 text-white" />;
    case "firefighters":
      return <ShieldAlert className="w-8 h-8 text-white" />;
    default:
      return <Phone className="w-8 h-8 text-white" />;
  }
};

export default function EmergencyPage() {
  const { t } = useLanguage();
  const { location, error: locationError } = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">{t("emergency.title")}</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Location Section */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h2 className="text-sm font-bold text-red-800 mb-2 uppercase tracking-wider">
            {t("emergency.yourLocation")}
          </h2>
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-red-600 flex-shrink-0" />
            {location ? (
              <p className="text-lg font-mono text-red-900">
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </p>
            ) : (
              <p className="text-red-800">{locationError || t("emergency.location.unavailable")}</p>
            )}
          </div>
          <p className="text-xs text-red-700 mt-2">{t("emergency.location.desc")}</p>
        </div>

        {/* Emergency Numbers */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("emergency.numbers")}</h2>
          <div className="space-y-3">
            {emergencyData.numbers.map((item) => (
              <a
                key={item.name}
                href={`tel:${item.number}`}
                className="w-full bg-gray-900 rounded-xl p-4 flex items-center justify-between shadow-lg hover:scale-105 transition-transform active:scale-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center">
                    <EmergencyIcon name={item.name} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{item.name}</p>
                    <p className="text-2xl font-mono text-gray-300 tracking-widest">{item.number}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full">
                  <Phone className="w-6 h-6 text-white" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Nearby Hospitals */}
        {/* <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("emergency.hospitals")}</h2>
          <div className="space-y-3">
            {emergencyData.hospitals.map((hospital) => (
              <a
                key={hospital.name}
                href={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{hospital.name}</p>
                  <p className="text-sm text-gray-600">{hospital.address}</p>
                </div>
                {location && (
                  <div className="text-right ml-4">
                    <p className="font-bold text-moroccan-blue text-lg">
                      {getDistance(location.latitude, location.longitude, hospital.latitude, hospital.longitude)} km
                    </p>
                    <p className="text-xs text-gray-500">Distance</p>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div> */}
      </main>
      <BottomNav activeTab="emergency" />
    </div>
  );
}
