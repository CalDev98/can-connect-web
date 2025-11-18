"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Crown, Bell, Globe, Trash2, Moon, Sun, Info, HelpCircle, Shield, Database, LogIn, LogOut, Mail } from "lucide-react";
import Link from "next/link";
import { usePlan } from "@/contexts/PlanContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { isPremium, user } = usePlan();
  const { language, setLanguage, t } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleClearCache = () => {
    if (confirm(t("settings.confirm.clearCache"))) {
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }
      localStorage.removeItem("messagesUsed");
      localStorage.removeItem("translationsUsed");
      localStorage.removeItem("lastResetDate");
      alert(t("settings.success.clearCache"));
      window.location.reload();
    }
  };

  const handleClearData = () => {
    if (confirm(t("settings.confirm.clearAll"))) {
      localStorage.clear();
      sessionStorage.clear();
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }
      alert(t("settings.success.clearAll"));
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">{t("settings.title")}</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Account Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">{t("settings.account")}</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {user ? (
              <>
                {/* Email Address */}
                <div className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t("settings.account.email")}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                {/* Premium Status */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isPremium ? "bg-moroccan-gold/20" : "bg-gray-100"}`}>
                      <Crown className={`w-5 h-5 ${isPremium ? "text-moroccan-gold" : "text-gray-600"}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {isPremium ? t("settings.account.premium") : t("settings.account.free")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isPremium
                          ? t("settings.account.premium.desc")
                          : t("settings.account.free.desc")}
                      </p>
                    </div>
                  </div>
                  {!isPremium && (
                    <Link
                      href="/offres"
                      className="bg-moroccan-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                    >
                      {t("settings.account.upgrade")}
                    </Link>
                  )}
                </div>
                 {/* Logout Button */}
                 <button
                  onClick={handleLogout}
                  className="w-full p-4 text-left flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600"
                >
                  <div className="p-2 rounded-lg bg-red-100">
                    <LogOut className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{t("settings.account.logout")}</p>
                  </div>
                </button>
              </>
            ) : (
              // Login Prompt
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-4">{t("settings.account.login.prompt")}</p>
                <Link
                  href="/login"
                  className="bg-moroccan-blue text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  {t("settings.account.login.button")}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">{t("settings.preferences")}</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {/* Language */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t("settings.preferences.language")}</p>
                  <p className="text-sm text-gray-600">{t("settings.preferences.language.desc")}</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "fr" | "en" | "es" | "pt" | "ar")}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-moroccan-blue"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="pt">Português</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            

            {/* Notifications */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t("settings.preferences.notifications")}</p>
                  <p className="text-sm text-gray-600">{t("settings.preferences.notifications.desc")}</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications ? "bg-moroccan-blue" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">{t("settings.data")}</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {/* Clear Cache */}
            <button
              onClick={handleClearCache}
              className="w-full p-4 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-yellow-100">
                <Trash2 className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{t("settings.data.clearCache")}</p>
                <p className="text-sm text-gray-600">{t("settings.data.clearCache.desc")}</p>
              </div>
            </button>

            {/* Clear All Data */}
            <button
              onClick={handleClearData}
              className="w-full p-4 text-left flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600"
            >
              <div className="p-2 rounded-lg bg-red-100">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("settings.data.clearAll")}</p>
                <p className="text-sm text-red-500">{t("settings.data.clearAll.desc")}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Privacy & Security Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">{t("settings.privacy")}</h2>
          </div>
          <div className="divide-y divide-gray-200">
            <Link
              href="/privacy"
              className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-indigo-100">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{t("settings.privacy.policy")}</p>
                <p className="text-sm text-gray-600">{t("settings.privacy.policy.desc")}</p>
              </div>
            </Link>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">{t("settings.about")}</h2>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-moroccan-blue/20">
                  <Info className="w-5 h-5 text-moroccan-blue" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">CANConnect</p>
                  <p className="text-sm text-gray-600">{t("settings.about.version")}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {t("settings.about.desc")}
              </p>
            </div>

            <Link
              href="/help"
              className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-blue-100">
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{t("settings.about.help")}</p>
                <p className="text-sm text-gray-600">{t("settings.about.help.desc")}</p>
              </div>
            </Link>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 mb-6">
          <p>{t("settings.footer")}</p>
          <p className="mt-2">
            {t("settings.footer.dev")}
          </p>
        </div>
      </div>
    </div>
  );
}

