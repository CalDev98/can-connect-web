"use client";

import Link from "next/link";
import Image from "next/image";
import { usePlan } from "@/contexts/PlanContext";
import { useMemo } from "react";
import {
  Menu,
  User,
  Bot,
  Languages,
  MapPin,
  HelpCircle,
  Calendar,
  Home,
  Map,
  UserIcon,
  ChevronRight,
  Crown,
  Phone,
  Clock,
  Shield,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import matchesData from "@/data/matches.json"; // Import matches data

const countryCodes: { [key: string]: string } = {
  "Morocco": "ma", "Tanzania": "tz", "Senegal": "sn", "Mali": "ml",
  "Egypt": "eg", "Ghana": "gh", "Algeria": "dz", "Tunisia": "tn",
  "Nigeria": "ng", "Cameroon": "cm", "Ivory Coast": "ci", "Burkina Faso": "bf",
  "Congo": "cg", "Guinea": "gn"
};

export default function HomePage() {
  const { t, language } = useLanguage();
  const { user } = usePlan();

  const nextMatch = useMemo(() => {
    const now = new Date();
    const upcomingMatches = matchesData.filter(match => {
      const matchDateTime = new Date(`${match.date}T${match.time}:00`);
      return matchDateTime > now;
    });
    // Sort by date and time to get the soonest match
    upcomingMatches.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}:00`);
      const dateB = new Date(`${b.date}T${b.time}:00`);
      return dateA.getTime() - dateB.getTime();
    });
    return upcomingMatches.length > 0 ? upcomingMatches[0] : null;
  }, [matchesData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = { fr: "fr-FR", en: "en-US", es: "es-ES", pt: "pt-PT", ar: "ar-MA" };
    return date.toLocaleDateString(localeMap[language] || "fr-FR", {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-moroccan-light" style={{
      backgroundImage: 'radial-gradient(circle, rgba(255, 249, 230, 0.4) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-800">CAN Connect</h1>
            <div className="flex items-center justify-center">
            
            <Link href="/offres" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Crown className="w-6 h-6 text-gray-800 text-moroccan-gold" />
            </Link>
            <Link href={user ? "/settings" : "/login"} className="p-2 flex items-center gap-1 hover:bg-gray-100 rounded-lg transition-colors">
              <UserIcon className="w-5 h-5 text-gray-600" />
            </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-20">
        <div className="container mx-auto py-4 px-4">
          {/* Welcome Section */}
          {/* <div className="pt-6 pb-4">
            <h2 className="text-3xl font-bold text-gray-900">{t("home.welcome")}</h2>
          </div> */}

          {/* Moroccan Gateway Visual */}
          <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-64 w-full bg-gradient-to-br from-moroccan-blue to-moroccan-gold flex items-center justify-center">
              {/* Abstract Moroccan Pattern */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 100% 150%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 0% -50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                backgroundSize: '50% 50%',
              }}></div>
              {/* Archway / Keyhole effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center">
                  <div className="w-32 h-32 bg-white/20 rounded-full"></div>
                </div>
              </div>
              <div className="relative z-10 text-center text-white">
                <h2 className="text-3xl font-bold drop-shadow">{t("home.welcome")}</h2>
                {/* <p className="text-lg mt-1 drop-shadow">CANConnect</p> */}
              </div>
            </div>
          </div>

          {/* Featured Match Card */}
          {nextMatch ? (
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-moroccan-blue uppercase tracking-wider">
                  {t("home.nextMatch")}
                </span>
                <Link
                  href="/matches"
                  className="text-sm text-moroccan-blue hover:underline flex items-center gap-1"
                >
                  {t("home.viewSchedule")} <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex items-center justify-around py-2">
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={`https://flagcdn.com/w40/${countryCodes[nextMatch.team1]?.toLowerCase()}.png`}
                    alt={`${nextMatch.team1} flag`}
                    className="w-10 h-10 object-contain rounded-full shadow-sm"
                  />
                  <span className="text-sm font-bold text-gray-800">{nextMatch.team1}</span>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">VS</p>
                  <p className="text-xs text-gray-500">{nextMatch.time} GMT+1</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={`https://flagcdn.com/w40/${countryCodes[nextMatch.team2]?.toLowerCase()}.png`}
                    alt={`${nextMatch.team2} flag`}
                    className="w-10 h-10 object-contain rounded-full shadow-sm"
                  />
                  <span className="text-sm font-bold text-gray-800">{nextMatch.team2}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3 text-sm text-gray-600 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(nextMatch.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{nextMatch.stadium}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {t("home.matches")}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {t("home.matches.desc")}
              </p>
              <Link
                href="/matches"
                className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium mx-auto w-fit"
              >
                {t("home.viewSchedule")}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* AI Assistant */}
            <Link href="/assistant">
              <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-moroccan-yellow p-3 rounded-full mb-3">
                    <Bot className="w-8 h-8 text-moroccan-gold" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">
                    {t("home.aiAssistant")}
                  </h3>
                  <p className="text-xs text-gray-600">{t("home.aiAssistant.desc")}</p>
                </div>
              </div>
            </Link>

            {/* Darija Translation */}
            <Link href="/translate">
              <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-moroccan-yellow p-3 rounded-full mb-3">
                    <Languages className="w-8 h-8 text-moroccan-gold" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">
                    {t("home.translation")}
                  </h3>
                  <p className="text-xs text-gray-600">{t("home.translation.desc")}</p>
                </div>
              </div>
            </Link>

            {/* Locate Stadiums */}
            <Link href="/stadiums">
              <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-moroccan-yellow p-3 rounded-full mb-3">
                    <MapPin className="w-8 h-8 text-moroccan-gold" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">
                    {t("home.stadiums")}
                  </h3>
                  <p className="text-xs text-gray-600">{t("home.stadiums.desc")}</p>
                </div>
              </div>
            </Link>

            {/* Emergency & Help */}
            <Link href="/emergency">
              <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-moroccan-yellow p-3 rounded-full mb-3">
                    <HelpCircle className="w-8 h-8 text-moroccan-gold" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">
                    {t("home.emergency")}
                  </h3>
                  <p className="text-xs text-gray-600">{t("home.emergency.desc")}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5 text-green-800" />
              <span className="text-xs font-medium text-green-800">{t("nav.home")}</span>
            </Link>
            <Link
              href="/translate"
              className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors"
            >
              <Languages className="w-5 h-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">{t("nav.translation")}</span>
            </Link>
            <Link
              href="/emergency"
              className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">{t("nav.emergency")}</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
