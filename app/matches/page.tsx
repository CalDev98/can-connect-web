"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, Calendar, Clock, Shield, MapPin, Tv } from "lucide-react";
import Link from "next/link";
import matchesData from "@/data/matches.json";
import { useLanguage } from "@/contexts/LanguageContext";

// --- Helper Data & Functions ---

const countryCodes: { [key: string]: string } = {
  "Morocco": "ma", "Tanzania": "tz", "Senegal": "sn", "Mali": "ml",
  "Egypt": "eg", "Ghana": "gh", "Algeria": "dz", "Tunisia": "tn",
  "Nigeria": "ng", "Cameroon": "cm", "Ivory Coast": "ci", "Burkina Faso": "bf",
  "Congo": "cg", "Guinea": "gn"
};

const getMatchStatus = (date: string, time: string) => {
  const matchDateTime = new Date(`${date}T${time}:00`);
  const now = new Date();
  const matchEnd = new Date(matchDateTime.getTime() + 120 * 60000); // Assume 120 mins for a match

  if (now > matchEnd) return "Finished";
  if (now >= matchDateTime && now <= matchEnd) return "Live";
  return "Upcoming";
};

// --- Components ---

const MatchCard = ({ match, status }: { match: any; status: string }) => {
  const { t } = useLanguage();
  const team1Code = countryCodes[match.team1]?.toLowerCase();
  const team2Code = countryCodes[match.team2]?.toLowerCase();

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1.5">
            <Shield size={14} />
            <span>{t("matches.group", { group: match.group })}</span>
          </div>
          {status === "Live" && (
            <div className="flex items-center gap-1.5 text-red-600 font-bold animate-pulse">
              <Tv size={14} />
              <span>{t("matches.live")}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-around">
          <div className="flex-1 flex flex-col items-center gap-2 text-center">
            <img
              src={`https://flagcdn.com/w80/${team1Code}.png`}
              alt={`${match.team1} flag`}
              className="w-12 h-12 object-contain rounded-full shadow-md"
            />
            <span className="font-bold text-gray-800">{match.team1}</span>
          </div>

          <div className="text-center">
            {status === "Finished" ? (
              <span className="text-4xl font-bold text-gray-900">2 - 1</span>
            ) : status === "Live" ? (
              <span className="text-4xl font-bold text-green-600">1 - 0</span>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-800">{match.time}</span>
                <span className="text-xs text-gray-500">GMT+1</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center gap-2 text-center">
            <img
              src={`https://flagcdn.com/w80/${team2Code}.png`}
              alt={`${match.team2} flag`}
              className="w-12 h-12 object-contain rounded-full shadow-md"
            />
            <span className="font-bold text-gray-800">{match.team2}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 text-xs text-gray-600 flex items-center justify-center gap-1.5">
        <MapPin size={14} />
        <span>{match.stadium}, {match.city}</span>
      </div>
    </div>
  );
};

const MatchesByDate = ({ date, matches, language }: { date: string; matches: any[]; language: string }) => {
  const formattedDate = new Date(date).toLocaleDateString(language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-3 sticky top-16 bg-gray-50 py-2">
        {formattedDate}
      </h2>
      <div className="space-y-4">
        {matches.map(match => (
          <MatchCard key={match.id} match={match} status={getMatchStatus(match.date, match.time)} />
        ))}
      </div>
    </div>
  );
};

export default function MatchesPage() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Live" | "Finished">("Upcoming");

  const filteredMatches = useMemo(() => {
    return matchesData.filter(match => getMatchStatus(match.date, match.time) === activeTab);
  }, [activeTab]);

  const groupedByDate = useMemo(() => {
    return filteredMatches.reduce((acc, match) => {
      const date = match.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(match);
      return acc;
    }, {} as Record<string, any[]>);
  }, [filteredMatches]);

  const tabs = ["Upcoming", "Live", "Finished"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">{t("matches.title")}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Tab Filters */}
      <div className="sticky top-[57px] bg-white z-10 border-b border-gray-200">
        <div className="container mx-auto px-4 flex justify-center">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-moroccan-blue border-b-2 border-moroccan-blue"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t(`matches.tabs.${tab.toLowerCase()}`)}
            </button>
          ))}
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        {Object.keys(groupedByDate).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([date, matches]) => (
              <MatchesByDate key={date} date={date} matches={matches} language={language} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">{t("matches.empty.title")}</h3>
            <p className="text-gray-500 mt-2">{t("matches.empty.desc", { tab: activeTab.toLowerCase() })}</p>
          </div>
        )}
      </main>
    </div>
  );
}
