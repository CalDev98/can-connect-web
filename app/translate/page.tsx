"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft, Copy, Volume2, Loader2, Check, X, Crown, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import BottomNav from "@/components/BottomNav";
import LanguageSwitch from "../components/LanguageSwitch";

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
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-red-900">
        <div className="max-w-5xl w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-2xl font-bold text-white">{t("translate.title")}</h1>
            <div className="flex items-center gap-2">
              <Link href="/offres" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Crown className="w-6 h-6 text-yellow-500" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl w-full px-4 py-6">
        <div className="md:flex md:gap-6">
          {/* Output Panel */}
          <div className="md:w-1/2">
            {result ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-lg border-transparent transition-shadow hover:shadow-xl min-h-[100px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{t("translate.arabic")}</h3>
                    <button
                      onClick={() => handleCopy(result.arabic, "arabic")}
                      className="p-2 hover:bg-gray-200/50 rounded-lg transition-colors"
                      title="Copier"
                    >
                      {copied === "arabic" ? (
                        <Check className="w-5 h-5 text-red-900" />
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
                <div className="bg-red-100 rounded-xl p-4 shadow-lg border-transparent transition-shadow hover:shadow-xl min-h-[100px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{t("translate.phonetic")}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(result.phonetic, "phonetic")}
                        className="p-2 hover:bg-gray-200/50 rounded-lg transition-colors"
                        title="Copier"
                      >
                        {copied === "phonetic" ? (
                          <Check className="w-5 h-5 text-red-900" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                      {/* <button
                        onClick={handleSpeak}
                        className="p-2 hover:bg-gray-200/50 rounded-lg transition-colors"
                        title="Écouter"
                      >
                        <Volume2 className="w-5 h-5 text-gray-600" />
                      </button> */}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="text-lg text-gray-800">{result.phonetic}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-xl p-4 shadow-md border-transparent min-h-[100px]">
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
                <div className="bg-gray-100 rounded-xl p-4 shadow-md border-transparent min-h-[100px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-700">{t("translate.phonetic")}</h3>
                    <div className="flex gap-2">
                      <Copy className="w-5 h-5 text-gray-400" />
                      {/* <Volume2 className="w-5 h-5 text-gray-400" /> */}
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
          {/* Input Panel */}
          <div className="mt-10 md:w-1/2">
            {/* Language Selection */}
            <div className="mb-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-sm font-medium text-gray-800">{t("translate.from")}</span>
              </div>
              <LanguageSwitch
                languages={languages}
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
              />
            </div>

            {/* Input Field */}
            <div className="mb-4">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t("translate.input.placeholder")}
                  className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none min-h-[200px] shadow-lg"
                  rows={6}
                  maxLength={500}
                />
                <div className="text-sm text-gray-500 mt-2 text-right">
                  {inputText.length} / 500
                </div>
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
        </div>

        <div className="flex justify-center my-4">
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || isLoading || limitError}
            className="w-full md:w-auto bg-gradient-to-r from-red-800 to-red-900 text-white px-10 py-4 rounded-full hover:from-red-900 hover:to-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 font-bold text-lg shadow-lg transform hover:scale-105"
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
          <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-700 mb-1">
                  {t("translate.limit.title")}
                </p>
                <p className="text-xs text-red-600 mb-3">
                  {t("translate.limit.message", { limit: translationsLimit })}
                </p>
                <Link
                  href="/offres"
                  className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  {t("translate.limit.upgrade")}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !limitError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-xl">
            Erreur: {error instanceof Error ? error.message : "Une erreur est survenue"}
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab="translate" />
    </div>
  );
}
