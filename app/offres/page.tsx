"use client";

import { useState } from "react";
import { ArrowLeft, Check, X, Crown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlan, PREMIUM_PRICE } from "@/contexts/PlanContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PremiumPage() {
  const { t } = useLanguage();
  const { isPremium } = usePlan();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleUpgrade = () => {
    setIsProcessing(true);
    router.push("/signup");
  };

  return (
    <div
      className="min-h-screen bg-moroccan-light"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255, 249, 230, 0.4) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">{t("premium.title")}</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isPremium ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-moroccan-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("premium.success.title")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("premium.success.desc")}
            </p>
            <Link
              href="/"
              className="inline-block bg-moroccan-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t("premium.success.back")}
            </Link>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t("premium.free.title")}</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{t("premium.free.messages")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{t("premium.free.translations")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <X className="w-5 h-5 text-red-600" />
                  <span className="text-gray-500 line-through">{t("premium.free.ads")}</span>
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-moroccan-gold">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Crown className="w-6 h-6 text-moroccan-gold" />
                  {t("premium.premium.title")}
                </h3>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-moroccan-gold mb-2">
                  {t("premium.premium.price", { price: PREMIUM_PRICE })}
                </div>
                <div className="text-gray-700 text-sm">
                  {t("premium.premium.lifetime")}
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-moroccan-gold" />
                  <span className="text-gray-900 font-medium">
                    {t("premium.premium.unlimited.messages")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-moroccan-gold" />
                  <span className="text-gray-900 font-medium">
                    {t("premium.premium.unlimited.translations")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-moroccan-gold" />
                  <span className="text-gray-900 font-medium">
                    {t("premium.premium.noAds")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-moroccan-gold" />
                  <span className="text-gray-900 font-medium">
                    {t("premium.premium.support")}
                  </span>
                </div>
              </div>
              <button
                onClick={handleUpgrade}
                disabled={isProcessing}
                className="w-full bg-moroccan-gold text-white px-6 py-4 rounded-lg hover:bg-moroccan-gold/80 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? t("premium.processing") : t("premium.button", { price: PREMIUM_PRICE })}
              </button>
            </div>



            <p className="text-gray-600 text-sm text-center">
              {t("premium.disclaimer")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

