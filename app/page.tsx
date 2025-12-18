"use client";

import Link from "next/link";
import Image from "next/image";
import { usePlan } from "@/contexts/PlanContext";
import { useMemo, useState, useEffect } from "react";
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
  TicketCheck
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import BottomNav from "@/components/BottomNav";
import { EmblaCarousel } from "@/components/Carousel";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useReactNativeData } from "@/hooks/useReactNativeData";

const countryCodes: { [key: string]: string } = {
  "MAR": "ma", "TAN": "tz", "SÉN": "sn", "MAL": "ml",
  "ÉGY": "eg", "ALG": "dz", "TUN": "tn",
  "NGR": "ng", "CMR": "cm", "CIV": "ci", "BFA": "bf",
  "RDC": "cd", "ZAM": "zm", "COM": "km",
  "AFS": "za", "ANG": "ao", "ZIM": "zw", "OUG": "ug",
  "BÉN": "bj", "BOT": "bw", "GEQ": "gq", "SOU": "sd",
  "GAB": "ga", "MOZ": "mz"
};

export default function HomePage() {
  const { t, language, setLanguage } = useLanguage();
  const { user } = usePlan();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data, isReady, isWebView } = useReactNativeData();

  useEffect(() => {
    if (isReady && data) {
      console.log("Data ready:", data);

      // Set language if present
      if (data.language) {
        // Ensure language is one of the supported types
        const supportedLanguages = ["fr", "en", "es", "pt", "ar"];
        if (supportedLanguages.includes(data.language)) {
          setLanguage(data.language as any);
        }
      }
    }
  }, [isReady, data, setLanguage]);

  // Load matches from localStorage on component mount
  useEffect(() => {
    const cachedMatches = localStorage.getItem("matches");
    if (cachedMatches) {
      try {
        const parsed = JSON.parse(cachedMatches);
        setMatches(parsed);
        setLoading(false);
      } catch (e) {
        console.error("Error parsing cached matches:", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Compute the next match from the loaded matches
  const nextMatch = useMemo(() => {
    if (matches.length === 0) {
      return null;
    }

    const now = new Date();
    const upcomingMatches = matches.filter((match: any) => {
      const dateTimeString = `${match.date}T${match.time}`;
      const matchDateTime = new Date(dateTimeString);
      const isFuture = matchDateTime > now;
      return isFuture;
    });

    // Sort by date and time to get the soonest match
    upcomingMatches.sort((a: any, b: any) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
    return upcomingMatches.length > 0 ? upcomingMatches[0] : null;
  }, [matches]);

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
      // backgroundImage: 'radial-gradient(circle, rgba(255, 249, 230, 0.4) 1px, transparent 1px)',
      // backgroundSize: '20px 20px',
      backgroundColor: "#fff"
    }}>
      {/* Header */}
      <header className="bg-red-900 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-white">CAN Connect</h1>
            <div className="flex items-center justify-center">
              <LanguageSwitcher />

              <Link href="/offres" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Crown className="w-6 h-6 text-moroccan-gold" />
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

          <EmblaCarousel />

          {/* Featured Match Card */}
          {nextMatch ? (
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-red-900 uppercase tracking-wider">
                  {t("home.nextMatch")}
                </span>
                <Link
                  href="/matches"
                  className="text-sm text-red-900 hover:underline flex items-center gap-1"
                >
                  {t("home.viewSchedule")} <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex items-center justify-around py-2">
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={`https://flagcdn.com/w40/${countryCodes[nextMatch.team1.code!]?.toLowerCase()}.png`}
                    alt={`${nextMatch.team1.name} flag`}
                    width={40}
                    height={30}
                    className="w-10 object-contain rounded shadow-sm"
                  />
                  <span className="text-sm font-bold text-gray-800">{nextMatch.team1.name}</span>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">VS</p>
                  <p className="text-xs text-gray-500">{nextMatch.time} GMT+1</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={`https://flagcdn.com/w40/${countryCodes[nextMatch.team2.code!]?.toLowerCase()}.png`}
                    alt={`${nextMatch.team2.name} flag`}
                    width={40}
                    height={30}
                    className="w-10 object-contain rounded shadow-sm"
                  />
                  <span className="text-sm font-bold text-gray-800">{nextMatch.team2.name}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3 text-sm text-gray-600 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(nextMatch.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{nextMatch.stadium.name}</span>
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
                className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium mx-auto w-fit"
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
              <div className="bg-white border border-gray-100 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow md:h-[150px]">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-red-50 p-3 rounded-full mb-3">
                    <Bot className="w-8 h-8 text-red-900 md:w-6 md:h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">
                    {t("home.aiAssistant")}
                  </h3>
                  <p className="text-xs text-gray-600">{t("home.aiAssistant.desc")}</p>
                </div>
              </div>
            </Link>

            {/* Darija Translation */}
            {/* <Link href="/translate">
              <div className="bg-white border border-gray-100 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow md:h-[150px]">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-red-50 p-3 rounded-full mb-3">
                    <Languages className="w-8 h-8 text-red-900 md:w-6 md:h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">
                    {t("home.translation")}
                  </h3>
                  <p className="text-xs text-gray-600">{t("home.translation.desc")}</p>
                </div>
              </div>
            </Link> */}

            {/* Locate Stadiums */}
            <Link href="/stadiums">
              <div className="bg-white border border-gray-100 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow md:h-[150px]">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-red-50 p-3 rounded-full mb-3">
                    <MapPin className="w-8 h-8 text-red-900 md:w-6 md:h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">
                    {t("home.stadiums")}
                  </h3>
                  <p className="text-xs text-gray-600">{t("home.stadiums.desc")}</p>
                </div>
              </div>
            </Link>

            {/* Buy Tickets */}
            <Link href="https://tickets.cafonline.com/fr">
              <div className="bg-white border border-gray-100 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow md:h-[150px]">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-red-50 p-3 rounded-full mb-3">
                    <TicketCheck className="w-8 h-8 text-red-900 md:w-6 md:h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">
                    {t("home.buyTickets")}
                  </h3>
                  <p className="text-xs text-gray-600">{t("home.buyTickets.desc")}</p>
                </div>
              </div>
            </Link>

            {/* Emergency & Help */}
            {/* <Link href="/emergency">
              <div className="bg-white border border-gray-100 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow md:h-[150px]">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-red-50 p-3 rounded-full mb-3">
                    <HelpCircle className="w-8 h-8 text-red-900 md:w-6 md:h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">
                    {t("home.emergency")}
                  </h3>
                  <p className="text-xs text-gray-600">{t("home.emergency.desc")}</p>
                </div>
              </div>
            </Link> */}
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}

      <BottomNav activeTab="home" />
    </div>
  );
}
