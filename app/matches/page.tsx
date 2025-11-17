"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, Search, ChevronDown, Calendar, MapPin, Building2 } from "lucide-react";
import Link from "next/link";
import matchesData from "@/data/matches.json";
import { useLanguage } from "@/contexts/LanguageContext";

interface Match {
  id: number;
  date: string;
  time: string;
  team1: string;
  team2: string;
  stadium: string;
  city: string;
  group: string;
}

export default function MatchesPage() {
  const { t, language } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<"city" | "stadium" | "date">("city");

  const groupedMatches = useMemo(() => {
    const groups: Record<string, Match[]> = {};
    matchesData.forEach((match: Match) => {
      if (!groups[match.group]) {
        groups[match.group] = [];
      }
      groups[match.group].push(match);
    });
    return groups;
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const localeMap: Record<string, string> = { fr: "fr-FR", en: "en-US", es: "es-ES", pt: "pt-PT", ar: "ar-MA" };
    const month = date.toLocaleDateString(localeMap[language] || "fr-FR", { month: "long" });
    return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}`;
  };

  const formatTime = (time: string) => {
    return `${time} (GMT+1)`;
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">{t("matches.title")}</h1>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        {/* Filter Bar */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedFilter("city")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === "city"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {t("matches.filter.city")}
            <ChevronDown className={`w-4 h-4 ${selectedFilter === "city" ? "text-red-700" : "text-gray-700"}`} />
          </button>
          <button
            onClick={() => setSelectedFilter("stadium")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === "stadium"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {t("matches.filter.stadium")}
            <ChevronDown className={`w-4 h-4 ${selectedFilter === "stadium" ? "text-red-700" : "text-gray-700"}`} />
          </button>
          <button
            onClick={() => setSelectedFilter("date")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === "date"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {t("matches.filter.date")}
            <Calendar className={`w-4 h-4 ${selectedFilter === "date" ? "text-red-700" : "text-gray-700"}`} />
          </button>
        </div>

        {/* Matches List */}
        <div className="space-y-6">
          {Object.entries(groupedMatches).map(([group, matches]) => (
            <div key={group}>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {t("matches.group", { group })}
              </h2>
              <div className="space-y-4">
                {matches.map((match: Match) => (
                  <div
                    key={match.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-sm text-gray-600">
                        {formatDate(match.date)} - {formatTime(match.time)}
                      </div>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {t("matches.group", { group: match.group })}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
                          {match.team1.substring(0, 3).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-900">{match.team1}</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-400">VS</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{match.team2}</span>
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
                          {match.team2.substring(0, 3).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{match.stadium}, {match.city}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            <Link href="/" className="flex flex-col items-center gap-1 py-2 px-4">
              <span className="text-xs text-gray-900">{t("nav.home")}</span>
            </Link>
            <div className="flex flex-col items-center gap-1 py-2 px-4">
              <Calendar className="w-5 h-5 text-red-600" />
              <span className="text-xs text-red-600 font-medium">{t("nav.matches")}</span>
            </div>
            <Link href="/stadiums" className="flex flex-col items-center gap-1 py-2 px-4">
              <Building2 className="w-5 h-5 text-gray-900" />
              <span className="text-xs text-gray-900">{t("nav.stadiums")}</span>
            </Link>
            <Link href="/emergency" className="flex flex-col items-center gap-1 py-2 px-4">
              <span className="text-xs text-gray-900">{t("nav.emergency")}</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
