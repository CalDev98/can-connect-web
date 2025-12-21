"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, Shield, MapPin, Tv, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabaseClient";

// --- Helper Data & Functions ---

const countryCodes: { [key: string]: string } = {
  "MAR": "ma", "TAN": "tz", "SÉN": "sn", "MAL": "ml",
  "ÉGY": "eg", "ALG": "dz", "TUN": "tn",
  "NGR": "ng", "CMR": "cm", "CIV": "ci", "BFA": "bf",
  "RDC": "cd", "ZAM": "zm", "COM": "km",
  "AFS": "za", "ANG": "ao", "ZIM": "zw", "OUG": "ug",
  "BÉN": "bj", "BOT": "bw", "GEQ": "gq", "SOU": "sd",
  "GAB": "ga", "MOZ": "mz"
};

const getMatchStatus = (match: any) => {
  if (match.status) {
    const status = match.status.toLowerCase();
    if (status === "finished") return "Finished";
    if (status === "live") return "Live";
    if (status === "upcoming") return "Upcoming";
  }

  const matchDateTime = new Date(`${match.date}T${match.time}`);
  const now = new Date();
  const matchEnd = new Date(matchDateTime.getTime() + 120 * 60000); // Assume 120 mins for a match

  if (now > matchEnd) return "Finished";
  if (now >= matchDateTime && now <= matchEnd) return "Live";
  return "Upcoming";
};

// --- Components ---

const MatchCard = ({ match, status }: { match: any; status: string }) => {
  const { t } = useLanguage();
  const team1Code = match.team1.code ? countryCodes[match.team1.code]?.toLowerCase() : null;
  const team2Code = match.team2.code ? countryCodes[match.team2.code]?.toLowerCase() : null;

  const score = status === "Finished" ? (match.score ? [match.score.team1, match.score.team2] : null) : status === "Live" ? match.live_score : null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1.5">
            <Shield size={14} />
            <span>{match.group ? t("matches.group", { group: match.group }) : match.stage}</span>
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
            {team1Code ? (
              <Image
                src={`https://flagcdn.com/w80/${team1Code}.png`}
                alt={`${match.team1.name} flag`}
                width={48}
                height={36}
                className="w-12 object-contain rounded shadow-md"
              />
            ) : (
              <div className="w-12 bg-gray-200 rounded shadow-md"></div>
            )}
            <span className="font-bold text-gray-800">{match.team1.name}</span>
          </div>

          <div className="text-center">
            {score ? (
              <span className="text-4xl font-bold text-gray-900">{score.join(" - ")}</span>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-800">{match.time.slice(0, 5)}</span>
                <span className="text-xs text-gray-500">GMT+1</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center gap-2 text-center">
            {team2Code ? (
              <Image
                src={`https://flagcdn.com/w80/${team2Code}.png`}
                alt={`${match.team2.name} flag`}
                width={48}
                height={36}
                className="w-12 object-contain rounded shadow-md"
              />
            ) : (
              <div className="w-12 bg-gray-200 rounded shadow-md"></div>
            )}
            <span className="font-bold text-gray-800">{match.team2.name}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 text-xs text-gray-600 flex items-center justify-center gap-1.5">
        <MapPin size={14} />
        <span>{match.stadium.name}, {match.stadium.city}</span>
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
      <h2 className="text-lg font-bold text-gray-800 mb-3 sticky top-16 bg-white py-2">
        {formattedDate}
      </h2>
      <div className="space-y-4">
        {matches.map(match => (
          <MatchCard key={match.id} match={match} status={getMatchStatus(match)} />
        ))}
      </div>
    </div>
  );
};

export default function MatchesPage() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Live" | "Finished">("Upcoming");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Load from LocalStorage immediately
    const cachedMatches = localStorage.getItem("matches");
    if (cachedMatches) {
      try {
        setMatches(JSON.parse(cachedMatches));
        setLoading(false);
      } catch (e) {
        console.error("Error parsing cached matches:", e);
      }
    }

    const fetchMatches = async () => {
      try {
        if (!supabase) return;

        const { data, error } = await supabase
          .from("matches")
          .select("*")
          .order("date", { ascending: true })
          .order("time", { ascending: true });

        if (error) throw error;

        const parsedMatches = data.map((match: any) => ({
          ...match,
          team1: typeof match.team1 === 'string' ? JSON.parse(match.team1) : match.team1,
          team2: typeof match.team2 === 'string' ? JSON.parse(match.team2) : match.team2,
          stadium: typeof match.stadium === 'string' ? JSON.parse(match.stadium) : match.stadium,
          score: typeof match.score === 'string' ? JSON.parse(match.score) : match.score,
        }));

        setMatches(parsedMatches);
        localStorage.setItem("matches", JSON.stringify(parsedMatches));
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching matches:", err);
        // Only set error if we don't have cached data
        if (!cachedMatches) {
          setError(err.message);
        }
      }
    };

    fetchMatches();

    // 2. Subscribe to Realtime changes
    if (!supabase) return;

    const channel = supabase
      .channel('matches_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
        },
        () => {
          // Refresh data on any change
          fetchMatches();
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  const filteredMatches = useMemo(() => {
    return matches.filter(match => getMatchStatus(match) === activeTab);
  }, [activeTab, matches]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  if (error && matches.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-2">Error loading matches</div>
        <div className="text-sm text-gray-500">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-red-900 border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-lg font-bold text-white">{t("matches.title")}</h1>
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
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab
                ? "text-red-900 border-b-2 border-red-900"
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
              <MatchesByDate key={date} date={date} matches={matches as any[]} language={language} />
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