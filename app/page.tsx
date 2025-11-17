"use client";

import Link from "next/link";
import Image from "next/image";
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
  Settings,
  ChevronRight,
  Crown,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-moroccan-light" style={{
      backgroundImage: 'radial-gradient(circle, rgba(255, 249, 230, 0.4) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-6 h-6 text-gray-800" />
            </button> */}
            <h1 className="text-lg font-bold text-gray-800">CAN Connect</h1>
            <div className="flex items-center justify-center">
            
            <button onClick={() => window.location.href = "/premium"} className="p-2 flex items-center gap-1 hover:bg-gray-100 rounded-lg transition-colors">
              Upgrade <Crown className="w-6 h-6 text-gray-800 text-moroccan-gold" />
            </button></div>
          </div>
        </div>
      </header>

      <main className="pb-20">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="pt-6 pb-4">
            <h2 className="text-3xl font-bold text-gray-900">{t("home.welcome")}</h2>
          </div>

          {/* Stadium Image */}
          <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-64 w-full bg-gradient-to-br from-green-500 via-green-600 to-green-700">
              {/* Stadium field pattern */}
              <div className="absolute inset-0">
                {/* Field lines */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-0 left-1/2 w-1 h-full bg-white/20 -translate-x-1/2"></div>
                {/* Stadium stands simulation */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-800/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-900/50"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Matchs & Infos Card */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {t("home.matches")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("home.matches.desc")}
                </p>
              </div>
              <Link
                href="/matches"
                className="bg-moroccan-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                {t("home.viewSchedule")}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

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
              <Home className="w-5 h-5 text-moroccan-blue" />
              <span className="text-xs font-medium text-moroccan-blue">{t("nav.home")}</span>
            </Link>
            {/* <Link
              href="/stadiums"
              className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors"
            >
              <Map className="w-5 h-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">{t("nav.stadiums")}</span>
            </Link> */}
            <Link
              href="/settings"
              className="flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">{t("nav.settings")}</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
