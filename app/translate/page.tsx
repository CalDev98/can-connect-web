"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft, Copy, Volume2, Loader2, Check, X, Crown, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import BottomNav from "@/components/BottomNav";

const languages = [
  { code: "fr", name: "Français" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
];

export default function TranslatePage() {
  const { t } = useLanguage();
  const [inputText, setInputText] = useState("");
  const [selectedLang, setSelectedLang] = useState("fr");
  const { result, translate, speak, isLoading, error, translationsUsed, translationsLimit, isPremium, canTranslate } = useTranslation();
  const [copied, setCopied] = useState<"arabic" | "phonetic" | null>(null);

  const limitError = !canTranslate();
  const remainingTranslations = isPremium ? "∞" : translationsLimit - translationsUsed;

  const handleTranslate = () => {
    if (inputText.trim() && canTranslate()) {
      translate(inputText);
    }
  };

  const handleCopy = (text: string, type: "arabic" | "phonetic") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSpeak = () => {
    if (result?.phonetic) {
      speak(result.phonetic);
    }
  };

  const clearInput = () => {
    setInputText("");
  };

  return (
    <div className="min-h-screen bg-moroccan-light pb-20" style={{
      backgroundImage: 'radial-gradient(circle, rgba(255, 249, 230, 0.4) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">{t("translate.title")}</h1>
            <div className="flex items-center gap-2">
              <Link href="/offres" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Crown className="w-6 h-6 text-moroccan-gold" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="md:flex md:gap-6">
          {/* Input Panel */}
          <div className="md:w-1/2">
            {/* Language Selection */}
            <div className="mb-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-sm font-medium text-gray-800">{t("translate.from")}</span>
              </div>
              <div className="flex gap-2 bg-white/50 border border-gray-200/50 rounded-full p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedLang === lang.code
                      ? "bg-white shadow-sm text-moroccan-blue"
                      : "text-gray-600 hover:bg-white/50"
                      }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Field */}
            <div className="mb-4">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t("translate.input.placeholder")}
                  className="w-full px-4 py-4 bg-white/80 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-moroccan-blue resize-none min-h-[200px] shadow-sm"
                  rows={6}
                />
                {inputText && (
                  <button
                    onClick={clearInput}
                    className="absolute top-3 right-3 w-8 h-8 bg-gray-200/50 rounded-full flex items-center justify-center hover:bg-gray-300/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Output Panel */}
          <div className="md:w-1/2">
            {result ? (
              <div className="space-y-4">
                {/* Arabic Script */}
                <div className="bg-white/80 border border-gray-200/50 rounded-xl p-4 shadow-sm min-h-[100px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{t("translate.arabic")}</h3>
                    <button
                      onClick={() => handleCopy(result.arabic, "arabic")}
                      className="p-2 hover:bg-gray-200/50 rounded-lg transition-colors"
                      title="Copier"
                    >
                      {copied === "arabic" ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="text-2xl text-gray-800" dir="rtl">
                      {result.arabic}
                    </p>
                  </div>
                </div>

                {/* Phonetic */}
                <div className="bg-white/80 border border-gray-200/50 rounded-xl p-4 shadow-sm min-h-[100px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{t("translate.phonetic")}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(result.phonetic, "phonetic")}
                        className="p-2 hover:bg-gray-200/50 rounded-lg transition-colors"
                        title="Copier"
                      >
                        {copied === "phonetic" ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={handleSpeak}
                        className="p-2 hover:bg-gray-200/50 rounded-lg transition-colors"
                        title="Écouter"
                      >
                        <Volume2 className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="text-lg text-gray-800">{result.phonetic}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Placeholder Arabic */}
                <div className="bg-white/50 border border-gray-200/50 rounded-xl p-4 shadow-sm min-h-[100px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-700">{t("translate.arabic")}</h3>
                    <Copy className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="text-sm text-gray-500" dir="rtl">
                      ترجمتك ستظهر هنا.
                    </p>
                  </div>
                </div>

                {/* Placeholder Phonetic */}
                <div className="bg-white/50 border border-gray-200/50 rounded-xl p-4 shadow-sm min-h-[100px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-700">{t("translate.phonetic")}</h3>
                    <div className="flex gap-2">
                      <Copy className="w-5 h-5 text-gray-400" />
                      <Volume2 className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500">
                      Votre traduction apparaîtra ici.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center my-4">
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || isLoading || limitError}
            className="bg-moroccan-blue text-white px-8 py-3 rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("translate.loading")}
              </>
            ) : (
              t("translate.button")
            )}
          </button>
        </div>

        {/* Limit Error */}
        {limitError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">
                  {t("translate.limit.title")}
                </p>
                <p className="text-xs text-red-700 mb-3">
                  {t("translate.limit.message", { limit: translationsLimit })}
                </p>
                <Link
                  href="/offres"
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  {t("translate.limit.upgrade")}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !limitError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            Erreur: {error instanceof Error ? error.message : "Une erreur est survenue"}
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab="translate" />
    </div>
  );
}
