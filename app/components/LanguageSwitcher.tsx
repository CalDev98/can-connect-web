"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as "fr" | "en" | "es" | "pt" | "ar");
  };

  return (
    <div className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
      <Languages className="w-6 h-6 text-white cursor-pointer" />
      <select
        onChange={handleLanguageChange}
        value={language}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Select language"
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="pt">Português</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
