"use client";

import { useState } from "react";
import { ArrowLeft, Phone, MapPin, ChevronDown } from "lucide-react";
import Link from "next/link";
import emergencyData from "@/data/emergency.json";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EmergencyPage() {
  const { t } = useLanguage();
  
  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const openMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-24">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-lg font-bold text-white">{t("emergency.title")}</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Emergency Numbers */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-4">{t("emergency.numbers")}</h2>
          <div className="space-y-3">
            {emergencyData.numbers.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    {index === 0 && <span className="text-white text-xl">🛡️</span>}
                    {index === 1 && <span className="text-white text-xl">🚑</span>}
                    {index === 2 && <span className="text-white text-xl">🔥</span>}
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-400 text-sm">{item.number}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCall(item.number)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{t("emergency.call")}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Hospitals */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-4">{t("emergency.hospitals")}</h2>
          <div className="space-y-3">
            {emergencyData.hospitals.map((hospital, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🏥</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{hospital.name}</p>
                    <p className="text-gray-400 text-sm">
                      {index === 0 ? "2.5 km" : "4.1 km"} - {hospital.address}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openMaps(hospital.latitude, hospital.longitude)}
                  className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Phrases */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-4">{t("emergency.phrases")}</h2>
          <div className="space-y-2">
            {emergencyData.phrases.slice(0, 3).map((phrase, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-4 flex items-center justify-between"
              >
                <p className="text-white">{phrase.english}</p>
                <ChevronDown className="w-5 h-5 text-white" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SOS Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <button className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50 hover:bg-red-700 transition-colors">
          <span className="text-white font-bold text-xl">SOS</span>
        </button>
      </div>
    </div>
  );
}
